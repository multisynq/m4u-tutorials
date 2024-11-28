
          import { Model, View } from '@croquet/croquet'

          export class PlayerMovement_Mgr_Model extends Model {
            init(options) {
              super.init(options)

              // Movement parameters
              this.moveSpeed = 5
              this.acceleration = 30
              this.deceleration = 20
              this.maxSpeed = 8
              this.jumpForce = 8
              this.gravity = 20
              this.groundLevel = 0.5
              this.friction = 3

              // Player states
              this.positions = new Map()
              this.velocities = new Map()
              this.isGrounded = new Map()
              this.playerInputs = new Map() // Track current input state for each player
              this.lastBroadcastTime = new Map() // Track last broadcast for each player

              this.broadcastInterval = 100 // Broadcast position every 100ms if moving

              this.subscribe('PlayerMove', 'inputChange', this.onInputChange)
              this.subscribe('PlayerMove', 'jump', this.onPlayerJump)
              this.subscribe('PlayerMove', 'initPlayer', this.onInitPlayer)

              this.future(16).tick()
            }

            tick() {
              const deltaTime = 0.016
              const now = this.now() // Current time

              for (const [playerId, velocity] of this.velocities) {
                let pos = this.positions.get(playerId)
                let vel = { ...velocity }
                let input = this.playerInputs.get(playerId) || { x: 0, z: 0 }
                let lastBroadcast = this.lastBroadcastTime.get(playerId) || 0

                // Apply input-based acceleration
                let targetVel = {
                  x: input.x * this.maxSpeed,
                  y: vel.y,
                  z: input.z * this.maxSpeed,
                }

                // Apply acceleration or friction based on input
                if (input.x !== 0 || input.z !== 0) {
                  vel.x = this.moveTowards(vel.x, targetVel.x, this.acceleration * deltaTime)
                  vel.z = this.moveTowards(vel.z, targetVel.z, this.acceleration * deltaTime)
                } else {
                  vel.x = this.applyFriction(vel.x, deltaTime)
                  vel.z = this.applyFriction(vel.z, deltaTime)
                }

                // Apply gravity
                if (pos.y > this.groundLevel) {
                  vel.y -= this.gravity * deltaTime
                }

                // Update position
                pos = {
                  x: pos.x + vel.x * deltaTime,
                  y: pos.y + vel.y * deltaTime,
                  z: pos.z + vel.z * deltaTime,
                }

                // Ground collision
                if (pos.y <= this.groundLevel) {
                  pos.y = this.groundLevel
                  vel.y = 0
                  this.isGrounded.set(playerId, true)
                } else {
                  this.isGrounded.set(playerId, false)
                }

                // Store updated values
                this.positions.set(playerId, pos)
                this.velocities.set(playerId, vel)

                // Broadcast position updates based on conditions
                const isMoving = Math.abs(vel.x) > 0.001 || Math.abs(vel.y) > 0.001 || Math.abs(vel.z) > 0.001
                const timeSinceLastBroadcast = now - lastBroadcast

                if (isMoving && timeSinceLastBroadcast >= this.broadcastInterval) {
                  this.publish('PlayerMove', 'positionUpdate', `${playerId}__${pos.x}__${pos.y}__${pos.z}__${vel.x}__${vel.y}__${vel.z}`)
                  this.lastBroadcastTime.set(playerId, now)
                }
              }

              this.future(16).tick()
            }

            onInputChange(data) {
              const [playerId, _inputX, _inputZ] = data.split('__')
              const inputX = parseFloat(_inputX)
              const inputZ = parseFloat(_inputZ)

              if (!this.velocities.has(playerId)) return

              this.playerInputs.set(playerId, { x: inputX, z: inputZ })
            }

            onInitPlayer(data) {
              const [playerId, _x, _y, _z] = data.split('__')
              const position = {
                x: parseFloat(_x),
                y: parseFloat(_y),
                z: parseFloat(_z),
              }

              this.positions.set(playerId, position)
              this.velocities.set(playerId, { x: 0, y: 0, z: 0 })
              this.isGrounded.set(playerId, true)
              this.playerInputs.set(playerId, { x: 0, z: 0 })
              this.lastBroadcastTime.set(playerId, this.now())

              // Send initial state
              this.publish('PlayerMove', 'positionUpdate', `${playerId}__${position.x}__${position.y}__${position.z}__0__0__0`)
            }

            onPlayerJump(playerId) {
              if (!this.isGrounded.get(playerId)) return

              const vel = this.velocities.get(playerId)
              vel.y = this.jumpForce
              this.velocities.set(playerId, vel)
              this.isGrounded.set(playerId, false)
            }

            moveTowards(current, target, maxDelta) {
              if (Math.abs(target - current) <= maxDelta) return target
              return current + Math.sign(target - current) * maxDelta
            }

            applyFriction(velocity, deltaTime) {
              const frictionForce = this.friction * deltaTime
              if (Math.abs(velocity) <= frictionForce) return 0
              return velocity > 0 ? velocity - frictionForce : velocity + frictionForce
            }
          }
          PlayerMovement_Mgr_Model.register('PlayerMovement_Mgr_Model')

          export class PlayerMovement_Mgr_View extends View {
            constructor(model) {
              super(model)
              this.model = model
            }
          }
        