// Tutorial 7 Models

import { Actor, mix, AM_Spatial, AM_Behavioral, Behavior, sphericalRandom, v3_add } from "@croquet/worldcore-kernel";
import { GameModelRoot } from "@multisynq/unity-js";

//------------------------------------------------------------------------------------------
//-- Behaviors -----------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

// Behaviors are simply actors without a spatial location or a pawn, so defining a new behavior
// is like defining a new actor.
//
// Every behavior has a pointer to the actor it's controlling. Most of the time, when you define a
// new behavior all you need to do is write two methods:
//
// * onStart() runs once when the behavior starts
// * do() runs every time the behavior ticks
//
// The delta value passed to do() is the time in milliseconds since the last tick. At some point
// a behavior should either call this.succeed() or this.fail(). Both destroy the behavior and inform
// the behavior's parent of its completion status. A behavior that doesn't succeed or fail will
// run until its actor is destroyed.

class InflateBehavior extends Behavior {

    get size() { return this._size || 3}
    get speed() { return this._speed || 0.5}

    onStart() {
        this.inflation = this.actor.scale[0];
    }

    do(delta) { // Increases the actor's scale until it reaches a target size
        this.inflation += this.speed * delta/1000;
        this.actor.set({scale: [this.inflation, this.inflation, this.inflation]});
        if (this.inflation > this.size) this.succeed();
    }

}
InflateBehavior.register('InflateBehavior');

class RiseBehavior extends Behavior {

    get height() { return this._height || 3}
    get speed() { return this._speed || 0.5}

    onStart() {
        this.top = this.actor.translation[1] + this.height;
    }

    do(delta) { // Moves the actor up until it reaches the top
        const y = this.speed * delta/1000;
        const translation = v3_add(this.actor.translation, [0,y,0]);
        this.actor.set({translation});
        if (translation[1] > this.top) this.succeed();
    }

}
RiseBehavior.register('RiseBehavior');

//------------------------------------------------------------------------------------------
//-- BaseActor -----------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

class BaseActor extends mix(Actor).with(AM_Spatial) {
    get gamePawnType() { return "groundPlane" }

    init(options) {
        super.init(options);
        this.subscribe("input", "pointerHit", this.doPointerHit);
    }

    doPointerHit(e) {
        // e has a list of hits { actor, xyz, layers }
        const { actor, xyz, layers } = e.hits[0];
        if (actor === this) {
            this.doSpawn(xyz);
        } else if (layers.includes("spawnedByBase")) {
            this.publish(actor.id, "kill");
        }
    }

    doSpawn(xyz) {
        TestActor.create({ parent: this, layers: ["spawnedByBase"], translation: xyz});
    }

}
BaseActor.register('BaseActor');

//------------------------------------------------------------------------------------------
//-- TestActor -----------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

// Now when a TestActor is killed, instead of just destroying itself it launches a suite of
// behaviors to float up and inflate until it pops.
//
// When you start several behaviors on the same actor by default they run concurrently,
// but composite behaviors allow you to combine behaviors in different ways.
//
// For example, SequenceBehavior runs a list of behaviors in order. It only starts the
// next behavior when the previous one succeeds. Here we use a SequenceBehavior to destroy
// the actor after it inflates to maximum size.

class TestActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get gamePawnType() { return "interactableCube" }

    init(options) {
        super.init(options);
        this.subscribe(this.id, "kill", this.doKill);
    }

    doKill() {
        if (this.dying) return; // Prevent an actor from being killed twice
        this.dying = true;
        const translation = v3_add(this.translation, [0,2,0]);
        this.set({translation});
        this.behavior.start({name: "RiseBehavior", height: 4, speed: 2});
        this.behavior.start({name: "SpinBehavior", axis: sphericalRandom(), speed: 0.4});
        this.behavior.start({name: "SequenceBehavior", behaviors:[
            {name: "InflateBehavior", size: 3, speed: 0.4},
            "DestroyBehavior"
        ]});
    }
}
TestActor.register('TestActor');

//------------------------------------------------------------------------------------------
//-- ColorActor ----------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

class ColorActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get gamePawnType() { return "woodCube" }

    get color() { return this._color || [0.5,0.5,0.5] }

}
ColorActor.register('ColorActor');

//------------------------------------------------------------------------------------------
//-- MyModelRoot ---------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

export class MyModelRoot extends GameModelRoot {

    init(options) {
        super.init(options);
        console.log("Start model root!");
        this.base = BaseActor.create();
        this.parent = TestActor.create({parent: this.base, translation:[0,1,0]});
        this.child = ColorActor.create({parent: this.parent, translation:[0,0,-2]});

        this.parent.behavior.start({name: "SpinBehavior", axis: [0,-1,0], tickRate:500});
        this.child.behavior.start({name: "SpinBehavior", axis: [0,0,1], speed: 3});

        this.subscribe("input", "cDown", this.colorChange);

    }

    colorChange() {
        const color = [this.random(), this.random(), this.random()];
        this.child.set({color});
    }

}
MyModelRoot.register("MyModelRoot");
