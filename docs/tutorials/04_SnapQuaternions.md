## Tutorial 4 - Snap & Quaternions
*How to use snap to override view smoothing, and how rotations are stored.*

*Uses the `smoothedCube` prefab.*

![](images/image19.gif)

*Tutorial 4 adds the feature of snapping the objects back to their original positions, from which they then continue their smoothed motion.*

We add a reset method to pop the parent actor back to \[0,0,0\] and set its rotation to 45 degrees.

In the reset method we set the actor properties with **snap()**, instead of the **set()** used up to now.  **Snap** tells the pawn to use the new values without view smoothing; it's useful if you need to instantly teleport an actor to a new position.

Note that we can snap the rotation and translation simultaneously, while the spin behavior continues from the actor's new orientation.

Worldcore stores rotations internally as quaternions; you can create new quaternions with helper functions like **q\_euler()** or **q\_axisAngle()** .

```js
class ParentActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get gamePawnType() {
        return "smoothedCube";
    }

    init(options) {
        super.init(options);
        this.subscribe("input", "zDown", this.moveLeft);
        this.subscribe("input", "xDown", this.moveRight);
        this.subscribe("input", "nDown", this.reset);
    }

    reset() {
        console.log("reset");
        const rotation = q_euler(0, 0, toRad(45));
        this.snap({rotation, translation: [0, 0, 0]});
    }
}

ParentActor.register("ParentActor");
```