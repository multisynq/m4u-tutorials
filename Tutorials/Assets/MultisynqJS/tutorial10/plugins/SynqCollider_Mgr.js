import { Model, View } from '@croquet/croquet';
import { RAPIER } from '@croquet/worldcore-rapier';

export class SynqCollider_Mgr_Model extends Model {
  init(options) {
    super.init(options);
    this.subscribe('collider', 'initialize', this.onInitialize);

    // Initialize Rapier world if not already done (static only for collisions)
    if (!this.world) {
      this.world = new RAPIER.World(new RAPIER.Vector3(0, 0, 0));
      this.colliders = new Map();
      this.rigidBodies = new Map();
      this.eventQueue = new RAPIER.EventQueue(true);
      this.future(50).tick();
    }
  }

  onInitialize(msg) {
    const [netId, colliderDataJson] = msg.split('|');
    const colliderData = JSON.parse(colliderDataJson);

    // Create a static rigid body for the collider
    const rbDesc = RAPIER.RigidBodyDesc.fixed();
    const pos = colliderData.position;
    const rot = colliderData.rotation;
    rbDesc.setTranslation(pos[0], pos[1], pos[2]);
    rbDesc.setRotation(rot);
    const rigidBody = this.world.createRigidBody(rbDesc);
    this.rigidBodies.set(netId, rigidBody);

    // Create the collider
    let colliderDesc;
    switch (colliderData.type) {
      case 'box':
        const halfSize = colliderData.size.map(x => x/2);
        colliderDesc = RAPIER.ColliderDesc.cuboid(...halfSize);
        break;
      case 'sphere':
        colliderDesc = RAPIER.ColliderDesc.ball(colliderData.radius);
        break;
      case 'capsule':
        colliderDesc = RAPIER.ColliderDesc.capsule(
          colliderData.height/2,
          colliderData.radius
        );
        break;
    }

    // Set collision properties
    colliderDesc.setSensor(colliderData.isTrigger);
    if (colliderData.offset) {
      colliderDesc.setTranslation(...colliderData.offset);
    }

    // Store userData for collision identification
    colliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    
    const collider = this.world.createCollider(colliderDesc, rigidBody);
    collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL);
    
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
        this.publish('collider', 'collision', 
          `${netId1}|${netId2}|${started ? 'enter' : 'exit'}`
        );
      }
    });

    this.future(50).tick();
  }
}
SynqCollider_Mgr_Model.register('SynqCollider_Mgr_Model');

export class SynqCollider_Mgr_View extends View {
  constructor(model) {
    super(model);
    this.model = model;
  }
}
        