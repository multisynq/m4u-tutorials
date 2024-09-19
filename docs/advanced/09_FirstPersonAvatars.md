## Deterministic (Advanced)
### Tutorial 9 - First Person Avatars
*How to create a third-person avatar, and enabling users to “shove” other avatars.*

*Uses the groundPlane, woodCube and tutorial9Avatar prefabs.*

![](images/image13.gif)

*Tutorial 9 has a third-person avatar, with the ability (not shown here) to shove other avatars.*

The interaction supported by this tutorial is that when I click on some avatar other than my own, I push that avatar a small distance away from me. Two extra, driverless avatars are placed in the scene just to be pushed around.

To implement this we add " pointerHit" handling to the AvatarActor. When a pointerHit happens, every AvatarActor (driven or not) will receive the event. But according to the above rules, only the avatar whose user clicked in the scene needs to take any action. Because the event properties include the viewId of the originator, all we need to do is compare that viewId and the receiving actor's driver property. We can check whether the clicked object is an avatar by the presence of the "avatar" tag in its list of layers supplied by the hit event. The tutorial9Avatar prefab explicitly includes its Interactable component, rather than having it instantiated automatically on creation, so that we could set its "interactable layers " property to include " avatar" .

When there is an avatar to be shoved, we invoke its beShoved method directly (which is, of course, even more efficient than the actor-to-actor event used in Tutorial 6). If the avatar being shoved has a driver, we use a snap to impose its updated position, so as not to interfere with its user's control inputs.

The default color value defined for this actor, with its negative first value, ties in with a special interpretation in our Material System: if the first (i.e., red) value is -1, the color is ignored. This is useful when the prefab has a natural material state (in this case, a wood texture) that we would like to keep as-is unless and until an explicit color is applied.

```js
class AvatarActor extends mix(Actor).with(AM_Spatial, AM_Drivable) {
    get gamePawnType() {
        return "tutorial9Avatar";
    }

    get color() {
        return this._color || [-1, 0, 0];
    }

    init(options) {
        super.init(options);
        this.subscribe("input", "pointerHit", this.doPointerHit);
    }

    doPointerHit(e) {
        const originatingView = e.viewId;
        if (this.driver !== originatingView) return; // not this avatar's responsibility
        const { actor, layers } = e.hits[0];
        if (layers.includes('avatar') && actor !== this) {
            const away = v3_normalize(v3_sub(actor.translation, this.translation));
            actor.beShoved(away);
        }
    }

    beShoved(v) {
        const translation = v3_add(this.translation, v);
        if (this.driver) {
            this.snap({ translation }); // a driven avatar snaps
        } else {
            this.set({ translation }); // an undriven avatar lerps
        }
    }
}

AvatarActor.register('AvatarActor');
```

The **Mouse Look Avatar** component that appears on that prefab asks the **Mq_Drivable_System** which object is the currently active drivable - which by default is set according to the drivable whose driver property matches the local viewId. If the script finds that the active drivable is not the object it's currently running on, it ignores all user interaction. Otherwise it responds to a combination of mouse and keyboard: when the right mouse button is down, the mouse continuously updates the yaw, while the WASD keys determine movement.

The third-person camera following is handled by two components added to this scene's main camera: **Follow Cam** places the camera relative to a designated game object in the scene, and **Assign Follow Cam Target** uses the active-drivable setting - again, queried from the Drivable System - to designate that target.