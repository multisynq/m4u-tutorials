# Sample Project: Demolition

![](images/image8.gif)
----------------------

*How to create a multiplayer game with hundreds of perfectly synchronized blocks in Multisynq for Unity.*

*Introduces the use of Rapier physics and Join Codes, Creating Custom Unity-Editor Scene-Based levels, and level progression management. Also demonstrates how C4U can support crossplay with a web app, in this case launched through a QR code.*

The Multisynq Demolition app is on github here: [https://github.com/multisynq/m4u-demolition](https://github.com/multisynq/m4u-demolition) . See the releases page at [https://github.com/multisynq/m4u-demolition/releases](https://github.com/multisynq/m4u-demolition/releases) for pre-built MacOS and Windows builds.

Demolition serves as a demonstration of multiplayer synchronized physics. Players shoot projectiles at block structures whose initial setup can be specified either procedurally in the model code, or by manual placement in the Unity editor, or as a combination of the two. All physics calculations are carried out in the Croquet model, using the fully deterministic Rapier physics engine ( [https://rapier.rs/](https://rapier.rs/) ) to guarantee identical results for all players.

Demolition illustrates dramatically the benefit of fully client-side computation: a single missile-launch event sent via the reflector can be enough to trigger an explosion that sends hundreds of blocks flying through the air - but the choreography of those blocks' movements involves no further network traffic at all. Each player's Croquet client will compute exactly the same outcome.

This app includes a menu scene that lets a player specify a five-letter join code, or to request a new randomized code. Players who use the same join code will arrive in the same session, and can see each other's actions and their effects.

We have also implemented a web app that uses the same JavaScript model code as the Unity version, but has a simple THREE.js view in place of rendering with Unity. The web app is deployed to the Multisynq website. Because they are based on the same model code, the two versions naturally support cross-play. The pre-built Unity standalone builds include a QR code: scanning this code will launch a web view into the same session that the Unity app is in. Although the rendering styles are very different, running the two versions side by side shows that all the projectiles and blocks are moving in perfect synchronization.