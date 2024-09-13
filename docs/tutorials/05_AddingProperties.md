## Tutorial 5 - Adding Properties
*How to add new properties to actors, another use of random numbers, and how to transmit events with say() and listen().*

*Uses the colorableCube and smoothedCube prefabs.*

![](images/image9.gif)

*Tutorial 5 demonstrates how to dynamically modify object materials with the scene.*

We add a color property to the ChildActor. This way of defining properties allows us to make use of all of Worldcore's built-in machinery for setting properties. The property is stored internally in an underline-prefixed variable. If we never set it, the getter returns its default value.

```js
class ChildActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get gamePawnType() {
        return "colorableCube";
    }

    get color() {
        return this._color || [0.5, 0.5, 0.5];
    }
}

ChildActor.register("ChildActor");
```

When we create the child, we set its initial color to red.

We also added a handler in the model root to change the child to a random color whenever "c" is pressed. Anytime you call **random()** in the model it returns the same value for every user in the session. That means that although the new color is random, it's the SAME random color for every user. All the clients stay in sync.

```js
export class MyModelRoot extends GameModelRoot {
    init(options) {
        super.init(options);
        console.log("Start model root!");
        this.parent = ParentActor.create({ translation: [0, 0, 0] });
        this.child = ChildActor.create({ parent: this.parent, color: [1, 0, 0], translation: [0, 2, 0] });
        this.parent.behavior.start({ name: "SpinBehavior", axis: [0, 0, 1], tickRate: 500 });
        this.child.behavior.start({ name: "SpinBehavior", axis: [0, -1, 0], speed: 3 });
        this.subscribe("input", "cDown", this.colorChange);
    }

    colorChange() {
        const color = [this.random(), this.random(), this.random()];
        this.child.set({color});
    }
}

MyModelRoot.register("MyModelRoot");
```

This tutorial depends on the colorableCube prefab, which includes the **Material** mixin and declares **color** as a watched property. The **Material System** receives notifications whenever the color value changes on an object that has a **Material Component**, and automatically updates the color on any materials found on the object. For now, color is the only property handled by this system, but in the future it will be extended to offer a range of material properties and features across all HDRP and URP pipelines.