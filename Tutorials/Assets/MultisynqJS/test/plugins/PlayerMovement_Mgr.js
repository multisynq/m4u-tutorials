
          import { Model, View } from '@croquet/croquet'

          export class PlayerMovement_Mgr_Model extends Model {
            init(options) {
              super.init(options)

              // Movement parameters
              this.moveSpeed    = 0.3
              this.acceleration = 0.2
              this.deceleration = 1
              this.maxSpeed     = 1.2
              this.jumpForce    = 5
              this.gravity      = 10
              this.groundLevel  = 0.5
              this.friction     = 3

              // Player states
              this.positions   = new Map()
              this.velocities  = new Map()
              this.isGrounded  = new Map()
              this.playerState = new Map() // Track full player state (input, jumping)

              // Subscribe only to essential events from Unity
              this.subscribe('PlayerMove', 'input',      this.onInputChange)
              this.subscribe('PlayerMove', 'jump',       this.onPlayerJump )
              this.subscribe('PlayerMove', 'initPlayer', this.onInitPlayer )

              this.future(15).tick()
            }

            tick() {
              const deltaTime = 0.016

              for (const [playerId, state] of this.playerState) {
                if (!this.velocities.has(playerId)) continue

                let pos = this.positions.get(playerId)
                let vel = { ...this.velocities.get(playerId) }
                
                // Apply movement based on current state
                if (state.input) {
                  let targetVel = {
                    x: state.input.x * this.maxSpeed,
                    y: vel.y,
                    z: state.input.z * this.maxSpeed,
                  }

                  vel.x = this.moveTowards(vel.x, targetVel.x, this.acceleration * deltaTime)
                  vel.z = this.moveTowards(vel.z, targetVel.z, this.acceleration * deltaTime)
                } else {
                  vel.x = this.applyFriction(vel.x, deltaTime)
                  vel.z = this.applyFriction(vel.z, deltaTime)
                }

                // Apply gravity
                if (pos.y > this.groundLevel) vel.y -= this.gravity * deltaTime

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
                  state.jumping = false
                } else this.isGrounded.set(playerId, false)

                // Store updated values
                this.positions.set(playerId, pos)
                this.velocities.set(playerId, vel)
                this.playerState.set(playerId, state)

                // Send updates if there's any movement or we're not grounded
                if (!this.isGrounded.get(playerId) || Math.abs(vel.x) > 0.001 || Math.abs(vel.z) > 0.001) {
                  this.publish('PlayerMove', 'positionUpdate', `${playerId}__${pos.x}__${pos.y}__${pos.z}__${vel.x}__${vel.y}__${vel.z}`)
                }
              }

              this.future(1).tick()
            }

            onInputChange(data) {
              const [playerId, _inputX, _inputZ] = data.split('__')
              const inputX = parseFloat(_inputX)
              const inputZ = parseFloat(_inputZ)

              // Only update if values actually changed
              const state = this.playerState.get(playerId) || { input: null, jumping: false }
              if (inputX === 0 && inputZ === 0) state.input = null
              else state.input = { x: inputX, z: inputZ }
              this.playerState.set(playerId, state)
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
              this.playerState.set(playerId, { input: null, jumping: false })

              this.publish('PlayerMove', 'positionUpdate', `${playerId}__${position.x}__${position.y}__${position.z}__0__0__0`)
            }

            onPlayerJump(playerId) {
              if (!this.isGrounded.get(playerId)) return

              const vel = this.velocities.get(playerId)
              vel.y = this.jumpForce
              this.velocities.set(playerId, vel)

              const state = this.playerState.get(playerId)
              state.jumping = true
              this.playerState.set(playerId, state)
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
        