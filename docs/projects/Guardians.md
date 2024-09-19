# Sample Project: Guardians


![](images/image14.gif)

*How to create a multiplayer game with a thousand perfectly synchronized bots, missiles and avatars in Multisynq for Unity.*

*Introducing Navigation Grid and a deep dive on Behaviors.*

This section describes the Multisynq for Unity Guardians application available on github here: [https://github.com/multisynq/m4u-guardians](https://github.com/multisynq/m4u-guardians) . See the releases page at [https://github.com/multisynq/m4u-guardians/releases](https://github.com/multisynq/m4u-guardians/releases) for pre-built MacOS and Windows builds.

Guardians is a simple cooperative game where players defend their rocketship which has landed in an alien, futuristic world. It was designed to demonstrate how to create a multiplayer game with a number of features including:

*   Multiplayer Avatar control
*   Up to 1000 semi-intelligent bots that run perfectly synchronized on all players' systems.
*   Firing of any number of missiles that interact with their environment by bouncing off objects and destroying bots, also perfectly synchronized.
*   A number of static object barriers that the avatars, bots and missiles interact with.

The bots and missiles are particularly interesting, as they demonstrate large numbers of perfectly synchronized simulated objects. This is where Multisynq is especially powerful: you need only code the simulation, the movement of the object and its interaction with other objects within the world. There is no server management, and no netcode. Synchronization is automatic and perfect.

We also introduce navigation grids, which is a data structure used to quickly determine collisions among many objects.

Although Guardians takes place on a rolling sand dune world, the actual game design is completely 2D. All computations and collisions in the Croquet model are computed in a single plane. The view displays this flat data on a rolling hillside, and the objects all follow the terrain, but it has no effect on the game itself.

The next section is a deeper dive into the construction of these components.

Virtually all of the multiplayer game logic is in the Actors.js file.

## Barriers and the Navigation Grid


The avatars, bots and missiles interact with barriers in Guardians. Avatars collide with the bollards and the fins of the rocketship. The bots go around these without colliding. A missile will destroy a bot (and itself) if they collide, but will otherwise bounce off objects. As explained below, an avatar's interactions with the barriers are calculated locally, while missiles' and bots' interactions are calculated within the synchronized model.

A navigation grid is used in the Croquet model to place the barriers as well as to track the bots and missiles. An object can query the navigation grid to determine the barriers that are nearby and then compute whether the object is colliding with it or not. Some objects, like bollards and the spaceship, never move, but others like the bots and missiles are constantly moving and need to update their positions within the grid.

![](images/image18.png)

*Bollards are static objects within the scene that the avatars collide with. The bots will avoid them and go around, and the spherical missiles will simply bounce off them.*

We define the bollards and the towers within the scene with BollardActor and TowerActor respectively. These classes include AM\_Spatial as usual, along with AM\_OnGrid, which automatically inserts the object in the navigation grid for other objects to find it. The position of the object within the navigation grid is automatically updated as well, so you don’t need to update the avatar, bots or missiles yourself.

```js
//------------------------------------------------------------------------------------------
//--BollardActor, TowerActor ---------------------------------------------------------------
// Actors that place themselves on the grid so other actors can avoid them
//------------------------------------------------------------------------------------------

class BollardActor extends mix(Actor).with(AM_Spatial, AM_OnGrid) {
    get pawn() {
        return "BollardPawn";
    }

    get gamePawnType() {
        return "bollard";
    }

    get radius() {
        return this._radius;
    }
}
BollardActor.register('BollardActor');
```

The bollards are constructed within the init method of MyModelRoot, the final class in the file. The makeBollard function generates the bollard and specifies the tag “block” to be used by the navigation grid. We also specify obstacle: true , so that bots moving across the grid will collide with this object.

```js
makeBollard(x, z) {
    BollardActor.create({
        tags: ["block"],
        parent: this.base,
        obstacle: true,
        radius: 1.5,
        translation: [x, 0, z]
    });
}
```

Below is part of the inspector display for the bollard prefab. The **Raise Align To Terrain** script is a custom component, made for Guardians, that queries the scene's generated terrain object to find the height and slope at the point where the bollard has been placed. The properties in the "Raising" section in this case tell the script to place the bollard at exactly the terrain's height (zero extra, and zero random variation), and the "Alignment" section tells it to use a fraction (0.2) of the slope to set its angle off vertical .

This prefab is also equipped with a Collider and a Rigidbody, to generate a collision response when the tank acting as the local avatar collides with a bollard.

![](images/image11.png)

## Avatars
Avatars need to respond instantly to user controls and obstacle collisions. To achieve this, each user's avatar calculates its motion exclusively in that user's Unity view, and uses Multisynq to inform other users of how the avatar has already moved. Those users will see the movements with a slight delay due to reflector latency, but the delay has no effect on gameplay. This is in contrast to the firing of a missile, on which all users must see exactly the same effects: this is achieved by making every missile launch be a replicated event sent to the synchronized model. When any user clicks, or hits the spacebar, all users see the same newly generated missile set off on its assigned path.

![](images/image4.png)

*Multiple avatars. Each is controlled locally within Unity. This includes object collisions with the bollards and each other. Their location is automatically shared with other users.*

Within the Croquet side of the game, the avatar actor reacts to when a user takes a shot, constructing a new missile and sending it on its way. It also enables a camera godMode when the user selects the G key. The rest of the avatar control is in the Unity avatar prefab.

```js
//------------------------------------------------------------------------------------------
//-- AvatarActor ---------------------------------------------------------------------------
// This is you.
//------------------------------------------------------------------------------------------

class AvatarActor extends mix(Actor).with(AM_Spatial, AM_Drivable, AM_OnGrid) {
    get pawn() {
        return "AvatarPawn";
    }

    get gamePawnType() {
        return "tank";
    }

    init(options) {
        super.init(options);
        this.isAvatar = true;
        this.listen("shoot", this.doShoot);
        this.subscribe("all", "godMode", this.doGodMode);
    }

    get colorIndex() {
        return this._colorIndex;
    }

    doGodMode(gm) {
        this.say("doGodMode", gm);
    }

    doShoot(argFloats) {
        const [x, y, z, yaw] = argFloats;
        const aim = v3_rotate([0, 0, 1], q_axisAngle([0, 1, 0], yaw));
        const translation = [x, y, z];
        const missile = MissileActor.create({ parent: this.parent, translation, colorIndex: this.colorIndex });
        missile.go = missile.behavior.start({ name: "GoBehavior", aim, speed: missileSpeed, tickRate: 20 });
        missile.ballisticVelocity = aim.map(val => val * missileSpeed);
    }

    resetGame() {
        // this.say("goHome");
    }
}

AvatarActor.register('AvatarActor');
```

Below are some of the components on the "tank" prefab used for the avatar pawns in Guardians. In this case, the manifest declares the **Drivable** mixin to give the pawn the view-side-driven motion described above for the local avatar , and the **Smoothed** mixin for responding to position updates when the tank is representing a remote avatar - i.e., another user's. The also requests that the **colorIndex** property (for which the getter is seen in the code fragment above) be supplied on object creation; this is used by the custom **Set My Color From Index** script that is also seen here. Finally, the custom **Move Around** script carries out the actual driving of the local avatar's position based on horizontal- and vertical-axis inputs (whether from keyboard or some other controller).

![](images/image23.png)

The tank prefab also includes a Sphere Collider for interacting with obstacles such as the bollards, and an Audio Source for generating the sound that accompanies a locally generated shot.

## Bots
The bots attack the rocketship, but avoid everything else. They will move around the bollards and the avatars, and each other. When they get too close to any other moving object, they will move away from that object. This is where the navigation grid demonstrates its value. We may have as many as 1000 bots in a scene, and they are all avoiding each other and everything else.

 ![](images/image21.png) 

*The bots moving toward the rocketship. They move around the bollards and other barriers, and avoid the tanks.*

Bots are generated in waves with the makeWave function in the MyModelRoot class. Waves are only generated if the game has not ended. Each wave has slightly more bots within it with a maximum total of 1000 bots in the world. The bots are generated coming from a random direction around the rocketship, with each bot adding a random delta to this direction (plus or minus) and a random distance to spread them out. Then each bot is generated at a random time offset using the future() message:

```js
this.future(Math.floor(Math.random() * 200)).makeBot(x, y, index);
```

The future message allows you to easily specify an offset to the current “now()” when an event will occur in the future. In this case, we are spreading out the generation of the bots randomly over a 200 millisecond time frame.

A new wave is generated every 30 seconds, so we use a similar future message for that.

```js
if (wave > 0) this.future(30000).makeWave(wave + 1, Math.floor(numBots * 1.2), key);
```

A wave value of 0 is for testing the system so can be ignored for now. This future message tells the system to run the same makeWave function we are inside of, but start 30 seconds from now(). The next wave will increase the number of bots generated by 20% or multiplying by 1.2.

```js
makeWave(wave, numBots, key = this.gameState.runKey) {
    // filter out scheduled waves from games that already finished
    if (this.gameState.gameEnded || key !== this.gameState.runKey) return;
    const { totalBots } = this.gameState;
    let actualBots = Math.min(this.maxBots, numBots);
    if (totalBots + actualBots > this.maxBots) actualBots = this.maxBots - totalBots;
    const r = this.spawnRadius; // radius of spawn
    const a = Math.PI * 2 * Math.random(); // come from random direction
    for (let n = 0; n < actualBots; n++) {
        const aa = a + (0.5 - Math.random()) * Math.PI / 4; // angle +/- Math.PI/4 around r
        const rr = r + 100 * Math.random();
        const x = Math.sin(aa) * rr;
        const y = Math.cos(aa) * rr;
        const index = Math.floor(20 * Math.random());
        // stagger when the bots get created
        this.future(Math.floor(Math.random() * 200)).makeBot(x, y, index);
    }
    if (wave > 0) this.future(30000).makeWave(wave + 1, Math.floor(numBots * 1.2), key);
    this.publish("bots", "madeWave", { wave, addedBots: actualBots });
}
```

The makeBot() function generates the new bot at the x,z target location.

```js
makeBot(x, z, index) {
    const bot = BotActor.create({
        parent: this.base,
        tags: ["block", "bot"],
        index,
        radius: 2,
        translation: [x, 0.5, z]
    });
    return bot;
}
```

When the bot is first constructed the init() runs both the doFlee() function, which is where it avoids other objects in the world, and the go() function, which starts a behavior that moves it towards the rocketship. Behaviors were first introduced in Tutorial 3.

### init()

The init() function is used to set up the bot state, such as defining the interaction radius, and also makes the initial calls to **doFlee()** and **go(target)**. These two functions regularly call themselves using the **this.future(ms).go(target)** message.

```js
get pawn() {
    return "BotPawn";
}

get gamePawnType() {
    return "bot";
}

get index() {
    return this._index || 0;
}

init(options) {
    super.init(options);
    this.radius = 5;
    this.radiusSqr = this.radius * this.radius;
    this.doFlee();
    this.go([0, 0, 0]);
}
```

### go(target)

The BotActor is moving towards the rocketship at the center of the world while avoiding obstacles, and then destroys itself when it gets sufficiently close to the target. The movement toward the rocketship is done using the GotoBehavior, which simply moves an object at a regular speed toward a target. To use behaviors, we need to specify that the BotActor has the AM\_Behavioral mixin. The **go()** function first checks to see if we have an active GotoBehavior, which we need to destroy first. We then generate a new GoBehavior with new random speed.

```js
go(target) {
    // console.log(target);
    if (this.ggg) {
        this.ggg.destroy();
        this.ggg = null;
    }
    const speed = (16 + 4 * Math.random());
    this.ggg = this.behavior.start({ name: "GotoBehavior", target, speed, noise: 2, radius: 1 });
}
```

### doFlee() and killMe()

The doFlee() function is where we enable the bots to avoid running into the bollards, the avatars and each other. It makes full use of the navigation grid. To start,the doFlee function determines if we are near (within 20 meters squared) of the rocketship. If so, then we call the **killme()** function with onTarget as true. The **killMe()** function generates the fireball pawn for the explosion, and then publishes that a bot was destroyed and onTarget was true - this is what alerts the rocketship that it has been damaged.

If the bot is still alive after that, the next section first uses a future message to have the **doFlee()** function run again in 100 milliseconds. This means that the bot checks around itself 10 times a second to see if it is colliding with other objects. This rate can be increased by dropping the **future()** argument. Thus, if you want to test at 20 times a second, call **this.future(50).doFlee()** where we test every 50 milliseconds.

The next thing to do is find all of the “block” tagged objects near the bot. The **pingAll(“block”)** function returns a list of all of the objects it finds within the local grid near the bot. A second argument to pingAll is the radius. In this case, we are simply testing whatever is in the same grid as the bot. We then iterate over this list and test if we are within the target radius. If so, we move away from it along the vector between the bot and the target object.

```js
killMe(s = 0.3, onTarget) {
    FireballActor.create({ translation: this.translation, scale: [s, s, s], onTarget });
    this.publish("bots", "destroyedBot", onTarget);
    this.destroy();
}

doFlee() {
    // blow up at the tower
    if (v_mag2Sqr(this.translation) < 20) this.killMe(1, true);
    // otherwise, check if we need to move around an object
    if (!this.doomed) {
        this.future(100).doFlee();
        const blockers = this.pingAll("block");
        if (blockers.length === 0) return;
        blockers.forEach(blocker => this.flee(blocker));
    }
}

flee(bot) {
    const from = v3_sub(this.translation, bot.translation);
    const mag2 = v_mag2Sqr(from);
    if (mag2 > this.radiusSqr) return;
    if (mag2 === 0) {
        const a = Math.random() * 2 * Math.PI;
        from[0] = this.radius * Math.cos(a);
        from[1] = 0;
        from[2] = this.radius * Math.sin(a);
    } else {
        let mag = Math.sqrt(mag2);
        if (bot.isAvatar) mag /= 2;
        from[0] = this.radius * from[0] / mag;
        from[1] = 0;
        from[2] = this.radius * from[2] / mag;
    }
    const translation = v3_add(this.translation, from);
    this.set({ translation });
}
```

When the game is over, the world is reset, so every temporary object in the scene needs to be destroyed. The **resetGame()** function is called on all of these object . Here it removes the go behavior and destroys this bot. It is important to note that when you destroy an object on the Croquet actor side, it is automatically destroyed on the Unity view side.

```js
resetGame() {
    if (this.ggg) {
        this.ggg.destroy();
        this.ggg = null;
    }
    this.destroy();
}
```

## Missiles

Missiles have a lot of similarity to the bots. They too interact with most objects in the scene - bouncing off the regular blocking objects like the bollards, and also bouncing off the tanks (this is a co-op game, so we didn’t want to be killed by friendly fire). They destroy the bots when they collide with them.

![](images/image7.gif)

*Where the bot behavior is to always move toward the rocketship, the missiles simply move in a straight line from wherever they are fired. They destroy the bots, but bounce off everything else.*

The missile is constructed by the avatar/user. When the user presses the spacebar or clicks (depending on the interface) a missile is generated within the AvatarActor doShoot(argFloats) function. Once the missile is constructed - using the same parent as the avatar which is the ground plane, we then add the “GoBehavior” behavior to the missile. This behavior simply has the missile move in a particular direction - forever, unless something affects it (see below).

```js
doShoot(argFloats) {
    // view is now expected to set the launch location, given that the launcher
    // can compensate for its own velocity
    const [x, y, z, yaw] = argFloats;
    const aim = v3_rotate([0, 0, 1], q_axisAngle([0, 1, 0], yaw));
    const translation = [x, y, z]; // v3_add([x, y, z], v3_scale(aim, 5));
    const missile = MissileActor.create({ parent: this.parent, translation, colorIndex: this.colorIndex });
    missile.go = missile.behavior.start({ name: "GoBehavior", aim, speed: missileSpeed, tickRate: 20 });
    missile.ballisticVelocity = aim.map(val => val * missileSpeed);
}
```

### The Missile init() and tick() functions

When the missile is first created by the avatar, the missile **init()** function is called. We want to ensure that it doesn’t fly off into the horizon forever, so the first thing we do is set a four second time until the missile is destroyed with the  **this.future(4000)**.destroy() function. This means that four seconds after the missile is launched, if it hasn’t already hit a bot, it will be automatically destroyed on both the Croquet side and the Unity side.

The last thing in the **init()** is to call **this.tick()** . This is the function that, like the bots above, tests the environment around it for collisions and responds accordingly. All that the **tick()** function does is call the **test()** function and then, if the object hasn’t been destroyed, it calls the tick function (itself) again in 10 milliseconds with **this.future(10).tick().**

```js
//------------------------------------------------------------------------------------------
//--MissileActor ---------------------------------------------------------------------------
// Fired by the tank - they destroy the bots but bounce off everything else
//------------------------------------------------------------------------------------------
const missileSpeed = 75;

class MissileActor extends mix(Actor).with(AM_Spatial, AM_Behavioral) {
    get pawn() { return "MissilePawn" }
    get gamePawnType() { return "missile" }

    init(options) {
        super.init(options);
        this.future(4000).destroy(); // destroy after some time
        this.lastTranslation = [0, 0, 0];
        this.lastBounce = null; // the thing we last bounced off
        this.tick();
    }

    resetGame() {
        this.destroy();
    }

    get colorIndex() { return this._colorIndex }

    tick() {
        this.test();
        if (!this.doomed) this.future(10).tick();
    }
}
```

### test()
The test() function is where the missile tests its environment for various collisions. It is already being moved by the “GoBehavior”, so we just need to regularly check the navigation grid for anything nearby. We first test for any bots nearby using the parent’s **pingAny() **function. This function returns the first bot it finds nearby. If we find it to be within 4 (or 2 \* 2) squared distance away, then we have the bot kill itself with an onTarget flag of false this time - so it does no damage to the spaceship. The missile then destroys itself as well.

If it does not hit a bot, then we test against any “block” objects like the bollards or the avatars. Again, we call **pingAny()** on the objects on the grid tagged with “block”. We test to see if we have hit our own avatar immediately after firing - which can happen occasionally, due to the momentary differences that arise between an avatar's calculated position for its own user and its replicated position in the model. We ignore any such hit, but otherwise check to see if we hit the “block” and, if so, bounce off it. Bouncing involves destroying the current “GoBehavior” and creating a new one with its direction determined by the bounce.

```js
test() {
    const bot = this.parent.pingAny("bot", this.translation, 4, this);
    if (bot) {
        const d2 = v_dist2Sqr(this.translation, bot.translation);
        if (d2 < 4) { // bot radius is 2
            bot.killMe(0.3, false);
            this.destroy();
            return;
        }
    }
    // the blockers (tagged with "block") include all avatars
    const blocker = this.parent.pingAny("block", this.translation, 4, this);
    if (blocker) {
        if (!this.lastBounce && blocker.tags.has("avatar") && blocker.colorIndex === this.colorIndex) {
            // ignore own avatar when it's the first object we've encountered
        } else if (blocker !== this.lastBounce) {
            const d2 = v_dist2Sqr(this.translation, blocker.translation);
            if (d2 < 2.5) {
                // console.log("bounce", blocker);
                this.lastBounce = blocker;
                let aim = v3_sub(this.translation, blocker.translation);
                aim[1] = 0;
                aim = v3_normalize(aim);
                if (this.go) this.go.destroy();
                this.go = this.behavior.start({ name: "GoBehavior", aim, speed: missileSpeed, tickRate: 20 });
                this.ballisticVelocity = aim.map(val => val * missileSpeed);
            }
        }
    }
    this.lastTranslation = this.translation;
}

MissileActor.register('MissileActor');
```

## The Game State Actor
The game state actor is used to track the game state such as when new waves of bots are generated, starting and ending the game and updating the game stats - such as the health of the rocketship. Like any other actor in Croquet, it can subscribe to published messages, but it has no visible state itself.

```js
//------------------------------------------------------------------------------------------
//-- GameStateActor ------------------------------------------------------------------------
// Manage global game state.
//------------------------------------------------------------------------------------------

class GameStateActor extends Actor {
    get gamePawnType() { return "gamestate" }

    init(options) {
        super.init(options);
        this.subscribe("game", "gameStarted", this.gameStarted);
        this.subscribe("bots", "madeWave", this.madeBotWave);
        this.subscribe("bots", "destroyedBot", this.destroyedBot);
        this.subscribe("stats", "update", this.updateStats);
    }

    gameStarted() {
        this.runKey = Math.random();
        this.wave = 0;
        this.totalBots = 0;
        this.health = 100;
        this.gameEnded = false;
        this.updateStats();
    }

    madeBotWave({ wave, addedBots }) {
        this.wave = wave;
        this.totalBots += addedBots;
        this.updateStats();
    }

    destroyedBot(onTarget) {
        this.totalBots--;
        if (onTarget && !this.demoMode) {
            this.health--;
            this.publish("stats", "health", this.health);
            if (this.health === 0) {
                console.log("publish the endGame");
                this.gameEnded = true;
                this.publish("game", "endGame");
            }
        }
        this.publish("stats", "bots", this.totalBots);
    }

    updateStats() {
        this.publish("stats", "wave", this.wave);
        this.publish("stats", "bots", this.totalBots);
        this.publish("stats", "health", this.health);
        if (this.gameEnded) this.publish("user", "endGame");
    }
}

GameStateActor.register('GameStateActor');
```