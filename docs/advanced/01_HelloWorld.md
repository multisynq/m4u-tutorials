## Deterministic (Advanced)
### Tutorial 1 - Hello World
How to set up your model root and view root, and how to create an object in the world.

Uses the basicCube prefab.

![](images/image16.gif)

*The foreground window is a Unity application built from this Tutorial 1 scene. It's important to note that these are **distinct clients** immediately able to join the same multiplayer reality. This demonstrates how easy it is to create multiplayer experiences with Multisynq. The x and z keys can be used to move the cube left and right.*

Every object in Multisynq for Unity is represented by an **actor / pawn** pair. Spawning an actor automatically instantiates a corresponding pawn. The **actor** is replicated across all clients, while the **pawn** is unique to each client.

The code below defines a new class of **actor** . **Actors** can be extended with mixins to give them new methods and properties. TestActor is extended by **AM\_Spatial ( Actor Mixin Spatial)** to give it a position in 3D space.

An actor's init method executes only once,  when the actor is first created in a brand new **Multisynq Session**. In this TestActor's init we specify that it will use the “basicCube” prefab. We also create two subscriptions to listen for keyboard events. When any user presses 'z' the basicCube actor will instantly move to the left, while pressing 'x' moves it right. The corresponding Unity basicCube pawn will automatically move on all participating users’ systems. Think of it as the Multisynq model and the Unity view sharing the object's translation. **This movement will occur for all participants in this session.**

All Worldcore **actor classes must be registered after they're defined.**

The following code completely describes the multiplayer interactions of the Tutorial 1 scene. There is no netcode, and the Models.js file is short, even including comments. You can access this within the Unity Tutorials here:
**Assets/MultisynqJS/ tutorial1/Models**
```js
class TestActor extends mix(Actor).with(AM_Spatial) {
    get gamePawnType() {
        return "basicCube";
    }

    init(options) {
        super.init(options);
        this.subscribe("input", "zDown", this.moveLeft);
        this.subscribe("input", "xDown", this.moveRight);
    }

    moveLeft() {
        console.log("left");
        const translation = this.translation;
        translation[0] += -0.1;
        this.set({translation});
    }

    moveRight() {
        console.log("right");
        const translation = this.translation;
        translation[0] += 0.1;
        this.set({translation});
    }
}

TestActor.register('TestActor');

```
The init method of the model root - which, again, is only ever executed once in the entire lifetime of its Multisynq session - assembles a basic scene, consisting of a single instance of TestActor.
```js
export class MyModelRoot extends ModelRoot {
    init(options) {
        super.init(options);
        console.log("Start model root!");
        this.test = TestActor.create({ translation: [0, 0, 0] });
    }
}

MyModelRoot.register("MyModelRoot");
```

**Note**: For all but tutorial 9, the Unity game camera will be placed according to its transform settings in the editor. It would be perfectly possible to synchronize camera position between users, but we do not demonstrate that here.