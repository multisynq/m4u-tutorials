import { Model, View } from '@croquet/croquet';

export class PlayerMovement_Mgr_Model extends Model {
  init(options) {
    super.init(options);

    // Movement parameters
    this.moveSpeed = 5;
    this.acceleration = 30;
    this.deceleration = 20;
    this.maxSpeed = 8;
    this.jumpForce = 8;
    this.gravity = 20;
    this.groundLevel = 0.5;
    this.friction = 3; // New friction parameter

    // Player states
    this.positions = new Map();  // playerId -> Vector3
    this.velocities = new Map(); // playerId -> Vector3
    this.isGrounded = new Map(); // playerId -> boolean
    this.lastSentPositions = new Map(); // To track last sent positions

    // Subscribe to input events from Unity
    this.subscribe('PlayerMove', 'input', this.onPlayerInput);
    this.subscribe('PlayerMove', 'jump', this.onPlayerJump);
    this.subscribe('PlayerMove', 'initPlayer', this.onInitPlayer);

    // Update physics at fixed intervals
    this.future(16).tick(); // ~60fps
  }

  tick() {
    const deltaTime = 0.016; // 16ms in seconds

    // Update each player's physics
    for (const [playerId, velocity] of this.velocities) {
      let pos = this.positions.get(playerId);
      let vel = velocity;
      let lastPos = this.lastSentPositions.get(playerId) || pos;

      // Apply gravity if not grounded
      if (pos.y > this.groundLevel) {
        vel.y -= this.gravity * deltaTime;
      }

      // Apply friction when grounded
      if (this.isGrounded.get(playerId)) {
        vel.x = this.applyFriction(vel.x, deltaTime);
        vel.z = this.applyFriction(vel.z, deltaTime);
      }

      // Update position
      pos = {
        x: pos.x + vel.x * deltaTime,
        y: pos.y + vel.y * deltaTime,
        z: pos.z + vel.z * deltaTime,
      };

      // Ground collision
      if (pos.y <= this.groundLevel) {
        pos.y = this.groundLevel;
        vel.y = 0;
        this.isGrounded.set(playerId, true);
      } else {
        this.isGrounded.set(playerId, false);
      }

      // Store updated values
      this.positions.set(playerId, pos);
      this.velocities.set(playerId, vel);

      // Only broadcast if there's significant movement
      const positionDelta = Math.abs(pos.x - lastPos.x) + 
                           Math.abs(pos.y - lastPos.y) + 
                           Math.abs(pos.z - lastPos.z);
      
      const velocityMagnitude = Math.abs(vel.x) + Math.abs(vel.y) + Math.abs(vel.z);
      
      if (positionDelta > 0.001 || velocityMagnitude > 0.001) {
        this.publish('PlayerMove', 'positionUpdate', `${playerId}__${pos.x}__${pos.y}__${pos.z}`);
        this.lastSentPositions.set(playerId, {...pos});
      }
    }

    this.future(16).tick();
  }

  applyFriction(velocity, deltaTime) {
    const frictionForce = this.friction * deltaTime;
    
    if (Math.abs(velocity) <= frictionForce) {
      return 0; // Stop completely if velocity is very small
    }
    
    return velocity > 0 
      ? velocity - frictionForce 
      : velocity + frictionForce;
  }

  onInitPlayer(input) {
    const [playerId, _x, _y, _z] = input.split('__');
    const position = { x: parseFloat(_x), y: parseFloat(_y), z: parseFloat(_z) };

    console.log('onInitPlayer', playerId, position);
    this.positions.set(playerId, position);
    this.lastSentPositions.set(playerId, {...position});
    this.velocities.set(playerId, { x: 0, y: 0, z: 0 });
    this.isGrounded.set(playerId, true);
    console.log('onInitPlayer (After Set)', playerId, this.positions.get(playerId), 
                this.velocities.get(playerId), this.isGrounded.get(playerId));
  }

  onPlayerInput(input) {
    const [playerId, _inputX, _inputZ] = input.split('__');
    const inputX = parseFloat(_inputX);
    const inputZ = parseFloat(_inputZ);

    console.log('onPlayerInput', playerId, inputX, inputZ);

    if (!this.velocities.has(playerId)) return;

    const vel = this.velocities.get(playerId);
    const targetVel = {
      x: inputX * this.maxSpeed,
      y: vel.y,
      z: inputZ * this.maxSpeed,
    };

    // Apply acceleration/deceleration
    const accelRate = inputX !== 0 || inputZ !== 0 ? this.acceleration : this.deceleration;

    vel.x = this.moveTowards(vel.x, targetVel.x, accelRate * 0.016);
    vel.z = this.moveTowards(vel.z, targetVel.z, accelRate * 0.016);

    console.log('vel', vel);
    this.velocities.set(playerId, vel);
  }

  onPlayerJump(playerId) {
    if (!this.isGrounded.get(playerId)) return;

    const vel = this.velocities.get(playerId);
    vel.y = this.jumpForce;
    this.velocities.set(playerId, vel);
    this.isGrounded.set(playerId, false);
  }

  moveTowards(current, target, maxDelta) {
    if (Math.abs(target - current) <= maxDelta) return target;
    return current + Math.sign(target - current) * maxDelta;
  }
}
PlayerMovement_Mgr_Model.register('PlayerMovement_Mgr_Model');

export class PlayerMovement_Mgr_View extends View {
  constructor(model) {
    super(model);
    this.model = model;
  }
}