## Deterministic (Advanced)
### Tutorial 2 - View Smoothing
*How to create parent-child relationships and use view smoothing, a first look at random numbers, and behavior implemented using future messages.*

*Uses the basicCube and smoothedCube prefabs.*

![](images/image5.gif)


*Tutorial 2 illustrates parent/child relationships, as well as smoothed motion.*

This time, we create three actors: a parent and two generations of children. The parent is defined to use the “smoothedCube” prefab. When you press the “x” and “z” keys, you will notice that the parent cube and its children move smoothly from one position to the next. A child's translation acts in relation to its parent.

```js
class ParentActor extends mix(Actor).with(AM_Spatial) {

    get gamePawnType() {
        return "smoothedCube";
    }

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

ParentActor.register('ParentActor');
```
For the children, we define a separate kind of actor - which doesn't subscribe to input events, but demonstrates basic Croquet time-based simulation by continuously spinning about the y axis.

In the **init** method, the actor defines its own rate of spin using a call to **Math.random**. As discussed further in Tutorial 5, this call is guaranteed to generate the same number for every user in the session; every user's first ChildActor, for example, will spin with the same randomized rate.

The **init** method then starts the spinning by calling **doSpin** , which applies a small delta to the actor's rotation property and then sends a future message to schedule another **doSpin** in 100 milliseconds' time. This keeps the spin going indefinitely.

```js
class ChildActor extends mix(Actor).with(AM_Spatial) {
    get gamePawnType() {
        return "basicCube";
    }

    init(options) {
        super.init(options);
        this.rate = Math.random() * 0.1 + 0.1;
        this.doSpin();
    }

    doSpin() {
        const q = q_axisAngle([0, 1, 0], this.rate);
        const rotation = q_multiply(this.rotation, q);
        this.set({rotation});
        this.future(100).doSpin(); // this is where the magic happens
    }
}

ChildActor.register("ChildActor");
```

Finally, we assemble the scene by creating the parent and the children, each child with a parent offset.

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