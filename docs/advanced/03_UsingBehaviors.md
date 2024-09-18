## Deterministic (Advanced)
### Tutorial 3 - Using Behaviors

*How to use behaviors to control actors.*

*Uses the smoothedCube prefab.*

![](images/image20.gif)

*Tutorial 3 demonstrates behaviors to add synchronized simulations to objects.*

**AM\_Behavioral** lets us attach behaviors to actors to control them. Behaviors are themselves actors that control other actors (but require no visible manifestation, and therefore have no Unity pawn). They can be simple or quite complex. There are a number of predefined behaviors that you can use, and you can easily create new ones. The spin behavior simply spins the object around an axis, in effect encapsulating the effect that we achieved in our own code in the previous tutorial. You will see how to create your own behaviors in Tutorial 7.

```js
class ParentActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get gamePawnType() { return "smoothedCube" }

    init(options) {
        super.init(options);
        this.subscribe("input", "zDown", this.moveLeft);
        this.subscribe("input", "xDown", this.moveRight);
    }

    moveLeft() {
        console.log("left");
        const translation = this.translation;
        translation[0] += -1;
        this.set({translation});
    }

    moveRight() {
        console.log("right");
        const translation = this.translation;
        translation[0] += 1;
        this.set({translation});
    }
}

ParentActor.register("ParentActor");
```

Again we define another actor that doesn't subscribe to input events.


```js
class ChildActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get gamePawnType() { return "smoothedCube" }
}
```

This time, after creating the parent and the child we give each one its own spin behavior. When you start behaviors you can pass in options with the behavior name.

```js
export class MyModelRoot extends ModelRoot {
    init(options) {
        super.init(options);
        console.log("Start model root!");
        const parent = ParentActor.create({ translation: [0, 0, 0] });
        const child = ChildActor.create({ parent: parent, translation: [0, 0, 3] });
        const _grandchild = ChildActor.create({ parent: child, translation: [0, 2, 0] });
    }
}

MyModelRoot.register("MyModelRoot");
```

The source for SpinBehavior and other "provided" behaviors is available within worldcore's [behavior code](https://github.com/croquet/worldcore/blob/eed7ce3066f884ece62b55885fcfb7fb1ec8cffc/packages/kernel/src/Behavior.js%23L564) .