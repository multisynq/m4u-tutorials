## Tutorial 8 - Basic Avatars
*How to create avatars.*

*Uses the groundPlane, woodCube and tutorial8Avatar prefabs.*

![](images/image10.gif)

*Tutorial 8 provides the first avatars to move and interact with the world. Each user controls their own avatar of course.*

We add the AM\_Drivable mixin to the new AvatarActor. Drivables have a driver property that holds the viewId of the user controlling them.

```js
class AvatarActor extends mix(Actor).with(AM_Spatial, AM_Drivable) {
    get gamePawnType() {
        return "tutorial8Avatar";
    }

    get color() {
        return this._color || [0.5, 0.5, 0.5];
    }
}

AvatarActor.register('AvatarActor');
```

UserManager is a model-side service that creates a special user actor whenever someone joins the session. You can query the UserManager to get a list of all current users, but right now we're going to use the user system to spawn an avatar.

```js
class MyUserManager extends UserManager {
    get defaultUser() {
        return MyUser;
    }
}

MyUserManager.register('MyUserManager');
```

When someone joins a session, a new user is created for them. When it starts up, the user creates an avatar that only that person can use. We randomly generate a color for the user, so we'll be able to tell avatars controlled by different people apart.

```js
class MyUser extends User {
    init(options) {
        super.init(options);
        const base = this.wellKnownModel("ModelRoot").base;
        this.color = [this.random(), this.random(), this.random()];
        this.avatar = AvatarActor.create({
            parent: base,
            driver: this.userId,
            color: this.color,
            translation: [0, 1, -10]
        });
    }

    destroy() {
        super.destroy();
        if (this.avatar) this.avatar.destroy();
    }
}

MyUser.register('MyUser');
```

A crucial behavior provided by the avatar is for a client to "drive" the avatar that is currently assigned to it. Driving means that the client updates the avatar position in its own view instantly (without a round-trip journey to the reflector), while also emitting position-update events that travel via the reflector to all clients. When such an event arrives back at the particular client that sent it, Worldcore recognizes that on this client the move has already happened, so the event can be ignored. All other clients update their local manifestations of the same pawn, using view smoothing.

The **tutorial8Avatar** prefab used for the avatar in this scene includes the **Overhead Avatar** component, that watches for movement keys (W, A, S, D or arrows), moves the local game object immediately, and sends over the bridge the events that will be used by other clients to synch to this avatar's position updates.