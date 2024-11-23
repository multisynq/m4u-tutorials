import { Actor, AM_Spatial, mix } from '@croquet/worldcore-kernel';
import { Model, View } from '@croquet/croquet';
import { RapierManager, AM_RapierWorld, AM_RapierRigidBody, RAPIER } from '@croquet/worldcore-rapier';
import { GameModelRoot, AM_InitializationClient } from '../../unity-js/src/game-support-models';

function arr2V3(arr) { return new RAPIER.Vector3(arr[0], arr[1], arr[2]) }
function arr2Q(arr)  { return new RAPIER.Quaternion(arr[0], arr[1], arr[2], arr[3]) }
function arrHalfed3(arr) { const hds = arr.map(x => x * 0.5); return [hds[0], hds[1], hds[2]] }
// function arr3(arr) { return [arr[0], arr[1], arr[2]] }
// function arr4(arr) { return [arr[0], arr[1], arr[2], arr[3]] }

/* @ts-ignore */
export class SynqPhysics_Mgr_Model extends GameModelRoot {
  world;
  rigidBodies = new Map();
  colliders = new Map();
  eventQueue;

  static modelServices() {
    return [RapierManager, ...super.modelServices()];
  }

  init(options) {
    super.init(); //super.init(options);   options are disallowed in GameModelRoot???? Odd.
    this.subscribe('collider', 'setup', this.onSetup);
    console.log('+++[Start] SynqPhysics_Mgr_Model.init()');
    // RapierManager.create({});
    this.base = BaseActor.create({ gravity: [0, -12, 0], translation: [0, 0, 0] });
    console.log('   [End] SynqPhysics_Mgr_Model.init()');
  }

  onSetup(msg) {
    const [netId, colliderDataJson] = msg.split('|');
    const colliderData = JSON.parse(colliderDataJson);

    // Create a static rigid body for the collider
    const rbDesc = RAPIER.RigidBodyDesc.fixed();
    const pos = colliderData.position;
    const rot = colliderData.rotation;
    rbDesc.setTranslation(pos[0], pos[1], pos[2]);
    rbDesc.setRotation(rot);
    const rigidBody = this.world.createRigidBody(rbDesc);
    this.rigidBodies ??= new Map(); // ensure Map exists
    this.rigidBodies.set(netId, rigidBody);

    // Create the collider
    let colliderDesc;
    switch (colliderData.type) {
      case 'box':
        const hs = arrHalfed3(colliderData.size); // halfSize
        colliderDesc = RAPIER.ColliderDesc.cuboid(hs[0], hs[1], hs[2]);
        break;
      case 'sphere':
        colliderDesc = RAPIER.ColliderDesc.ball(colliderData.radius);
        break;
      case 'capsule':
        colliderDesc = RAPIER.ColliderDesc.capsule(
          colliderData.height / 2,
          colliderData.radius
        );
        break;
    }

    // Set collision properties
    colliderDesc?.setSensor(colliderData.isTrigger);
    if (colliderData.offset) {
      const ct = colliderData.offset;
      colliderDesc?.setTranslation(ct[0], ct[1], ct[2]);
    }

    // Store userData for collision identification
    colliderDesc?.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    const collider = this.world.createCollider(colliderDesc, rigidBody);
    collider?.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL);

    // Store netId in userData for collision events
    rigidBody.userData = { netId: netId };

    this.colliders.set(netId, collider);
    console.log('Created collider for netId:', netId);
  }

  tick() {
    if (!this.world) return;

    // Step the world (minimal step since we only care about collisions)
    this.world.step(this.eventQueue);

    // Process collision events
    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const rb1 = this.world.getRigidBody(handle1.rigidBodyHandle());
      const rb2 = this.world.getRigidBody(handle2.rigidBodyHandle());

      if (rb1 && rb2 && rb1.userData && rb2.userData) {
        const netId1 = rb1.userData.netId;
        const netId2 = rb2.userData.netId;

        // Publish collision event
        this.publish('collider', 'collided',
          `${netId1}|${netId2}|${started ? 'enter' : 'exit'}`
        );
      }
    });

    this.future(50).tick();
  }
}
SynqPhysics_Mgr_Model.register('SynqPhysics_Mgr_Model');

export class SynqPhysics_Mgr_View extends View {
  constructor(model) {
    super(model);
    this.model = model;
  }
}


class BaseActor extends mix(Actor).with(AM_Spatial, AM_RapierWorld, AM_InitializationClient) {
  get pawn() { return 'BasePawn' }
  get gamePawnType() { return '' } // no Unity pawn

  init(options) {
    super.init(options);
    this.active = [];
    this.dynamics = new Set();
    this.versionBump = 0;
  }
}
BaseActor.register('BaseActor');

export class PhysicsActor extends mix(Actor).with(AM_Spatial, AM_RapierRigidBody) {
  static okayToIgnore() { return [...super.okayToIgnore(), '$rigidBody'] }

  get pawn() { return 'GamePawn' } // if not otherwise specialised
  get gamePawnType() { return this._type } // Unity prefab to use
  get type() { return this._type || 'primitiveCube' }
  get color() { return this._color || [0.3, 1.0, 0.3] } // greenish
  get alpha() { return this._alpha === undefined ? 1 : this._alpha }

  init(options) {
    super.init(options);
    this.subscribe('physics', 'setup', this.onSetup);
  }

  onSetup(setupInfo) {
    // Configure RigidBody
    const rbd = this.createRigidBodyDesc(setupInfo.rb);
    this.rigidBodyHandle = this.worldActor.createRigidBody(this, rbd);

    // Configure Collider
    const cd = this.createColliderDesc(setupInfo.col);
    this.createCollider(cd);

    // Apply initial velocities if specified
    if (setupInfo.rb.linearVelocity) {
      this.rigidBody.setLinvel(arr2V3(setupInfo.rb.linearVelocity), true);
    }
    if (setupInfo.rb.angularVelocity) {
      this.rigidBody.setAngvel(arr2V3(setupInfo.rb.angularVelocity), true);
    }
  }

  createRigidBodyDesc(rbInfo) {
    let rbd;
    switch (rbInfo.type) {
      case 'static':
        rbd = RAPIER.RigidBodyDesc.fixed();
        break;
      case 'kinematic':
        rbd = RAPIER.RigidBodyDesc.kinematicPositionBased();
        break;
      default:
        rbd = RAPIER.RigidBodyDesc.dynamic();
    }

    rbd?.setCcdEnabled(rbInfo.ccdEnabled);
    rbd?.setLinearDamping(rbInfo.linearDamping);
    rbd?.setAngularDamping(rbInfo.angularDamping);
    rbd.translation = arr2V3(rbInfo.translation);
    rbd.rotation    = arr2Q(rbInfo.rotation);

    return rbd;
  }

  createColliderDesc(colInfo) {
    let cd;
    switch (colInfo.type) {
      case 'sphere':
        cd = RAPIER.ColliderDesc.ball(colInfo.dimensions[0]);
        break;
      case 'capsule':
        cd = RAPIER.ColliderDesc.capsule(colInfo.dimensions[1], colInfo.dimensions[0]);
        break;
      default:
        const hds = arrHalfed3(colInfo.dimensions);
        cd = RAPIER.ColliderDesc.cuboid(hds[0], hds[1], hds[2]);
    }

    cd.setDensity(colInfo.density);
    cd.setFriction(colInfo.friction);
    cd.setRestitution(colInfo.restitution);
    cd.setSensor(colInfo.isTrigger);

    if (colInfo.center) {
      const ct = colInfo.center;
      cd.setTranslation(ct[0], ct[1], ct[2]);
    }

    return cd;
  }
}
PhysicsActor.register('PhysicsActor');
        