using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace Multisynq {

//========== |||||||||||||| ==================================
public class PlayerMovement_Mgr : JsPlugin_Behaviour {
  #region Fields
    // private Dictionary<string, PlayerMovement> players = new();
    new static public string[] CsCodeMatchesToNeedThisJs() => new[] {@"PlayerMovementController"}; 
  #endregion
  //------------------ ||||| ----------------------
  new static public Type[] BehavioursThatNeedThisJs() => new [] { 
    // typeof(Rigidbody),
    // typeof(Collider),
    typeof(PlayerMovementController),
    // typeof(SphereCollider),
    // typeof(BoxCollider),
    // typeof(CapsuleCollider)
  };
  //------------------ ||||| ----------------------
  override public void Start() {
    base.Start();
    // Croquet.Subscribe("SynqClone", "announceClone", OnAnnounceClone);
  }
  #region JavaScript
    //-------------------------- ||||||||||||||| -------------------------
    new static public JsPluginCode GetJsPluginCode() {
      return new(
        pluginName: "PlayerMovement_Mgr",
        pluginExports: new[] {"PlayerMovement_Mgr_Model", "PlayerMovement_Mgr_View"},
        pluginCode: @"
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

              // Player states - all data that Unity needs to read
              this.players = new Map() // Stores complete player state objects

              this.subscribe('PlayerMove', 'input', this.onInputChange)
              this.subscribe('PlayerMove', 'jump', this.onPlayerJump)
              this.subscribe('PlayerMove', 'initPlayer', this.onInitPlayer)

              this.future(15).tick()

              // this.player = this.players.get('player')
            }

            getPlayer(id) {
              return this.players.get(id)
            }

            getAllPlayers() {
              return Array.from(this.players.values())
            }

            tick() {
              const deltaTime = 0.016
              let updates = new Set() // Track which players actually changed

              for (const [playerId, player] of this.players) {
                const oldPos = {...player.position}
                const oldVel = {...player.velocity}

                // Update velocity based on input
                if (player.input) {
                  player.velocity.x = this.moveTowards(player.velocity.x, player.input.x * this.maxSpeed, this.acceleration * deltaTime)
                  player.velocity.z = this.moveTowards(player.velocity.z, player.input.z * this.maxSpeed, this.acceleration * deltaTime)
                } else {
                  player.velocity.x = this.applyFriction(player.velocity.x, deltaTime)
                  player.velocity.z = this.applyFriction(player.velocity.z, deltaTime)
                }

                // Apply gravity
                if (player.position.y > this.groundLevel) player.velocity.y -= this.gravity * deltaTime

                // Update position
                player.position.x += player.velocity.x * deltaTime
                player.position.y += player.velocity.y * deltaTime
                player.position.z += player.velocity.z * deltaTime

                // Ground collision
                if (player.position.y <= this.groundLevel) {
                  player.position.y = this.groundLevel
                  player.velocity.y = 0
                  player.isGrounded = true
                  player.jumping = false
                } else player.isGrounded = false

                // Check if state changed significantly
                if (!player.isGrounded || 
                    Math.abs(oldPos.x - player.position.x) > 0.001 || 
                    Math.abs(oldPos.y - player.position.y) > 0.001 || 
                    Math.abs(oldPos.z - player.position.z) > 0.001) {
                  updates.add(playerId)
                }
              }

              // Only publish updates for players that actually moved
              for (const playerId of updates) {
                const player = this.players.get(playerId)
                this.publish('PlayerMove', 'stateUpdated', JSON.stringify({ id: playerId, player }))
              }

              this.future(1).tick()
            }

            onInputChange(data) {
              const [playerId, _inputX, _inputZ] = data.split('__')
              const player = this.players.get(playerId)
              if (!player) return

              const inputX = parseFloat(_inputX)
              const inputZ = parseFloat(_inputZ)
              player.input = (inputX === 0 && inputZ === 0) ? null : { x: inputX, z: inputZ }
            }

            onInitPlayer(data) {
              const [playerId, _x, _y, _z] = data.split('__')
              const position = {
                x: parseFloat(_x),
                y: parseFloat(_y),
                z: parseFloat(_z)
              }

              this.players.set(playerId, {
                position,
                velocity: { x: 0, y: 0, z: 0 },
                isGrounded: true,
                jumping: false,
                input: null,
                lastUpdate: this.now()
              })
            }

            onPlayerJump(playerId) {
              const player = this.players.get(playerId)
              if (!player?.isGrounded) return

              player.velocity.y = this.jumpForce
              player.jumping = true
              player.isGrounded = false
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
        "
      );
    }
  #endregion

  #region Singleton
    private static PlayerMovement_Mgr _Instance;
    public  static PlayerMovement_Mgr I { // Usage:   SynqClones_Mgr.I.JsPluginFileName();
      get { return _Instance = Singletoner.EnsureInst(_Instance); }
    }
  #endregion
  }
}