// Tutorial 2 Views

import { Pawn, mix, GetViewService, m4_rotation, m4_translation, m4_multiply, m4_getTranslation, m4_getRotation, toRad } from "@croquet/worldcore-kernel"; // eslint-disable-line import/no-extraneous-dependencies
import { GameInputManager, GameViewRoot, PM_GameSmoothed, PM_GameRendered } from "../build-tools/sources/unity-bridge";

//------------------------------------------------------------------------------------------
// TestPawn --------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

// Instead of PM_GameSpatial, this pawn uses PM_GameSmoothed. Smoothed pawns blend toward
// their actor's position on every frame. Use them if you expect an object to move continuously,
// and need that movement to appear smooth.

export class TestPawn extends mix(Pawn).with(PM_GameRendered, PM_GameSmoothed) {
    constructor(actor) {
        super(actor);

        this.setGameObject({ type: 'primitiveCube' });
    }
}
TestPawn.register("TestPawn"); // All Worldcore pawns must be registered after they're defined.

//------------------------------------------------------------------------------------------
//-- MyViewRoot ----------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

// In this example we explicitly tell Unity where to place the camera.  The camera could be
// attached to a pawn (as seen in tutorial 9), but can also be referred to directly in
// commands such as updateGeometry by the name 'camera' that is known to the bridge.

// We use translationSnap and rotationSnap properties (instead of just translation, rotation)
// so that the camera moves instantly to the specified position.

export class MyViewRoot extends GameViewRoot {

    static viewServices() {
        return [GameInputManager].concat(super.viewServices());
    }
}
