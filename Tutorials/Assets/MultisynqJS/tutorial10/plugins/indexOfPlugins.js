// DO NOT EDIT, please.  =]
// This file is generater by the M4U build process.
// 
import { GameModelRoot } from '@croquet/game-models';
import { GameViewRoot } from '@croquet/unity-bridge';
// ########
import { SynqClones_Mgr_Model, SynqClones_Mgr_View } from './SynqClones_Mgr'
import { SynqCommand_Mgr_Model } from './SynqCommand_Mgr'
import { SynqVar_Mgr_Model, SynqVar_Mgr_View } from './SynqVar_Mgr'
// ########

//========== |||||||||||||||| =================================================================
export class PluginsModelRoot extends GameModelRoot {
  plugins={}
  init(options) {
    // @ts-ignore
    super.init(options);
    // ########  modelInits
    this.plugins['SynqClones_Mgr_Model'] = SynqClones_Mgr_Model.create({})
    this.plugins['SynqCommand_Mgr_Model'] = SynqCommand_Mgr_Model.create({})
    this.plugins['SynqVar_Mgr_Model'] = SynqVar_Mgr_Model.create({})
    // ########
    var x = '<ReactyOne style={ {color:"red"} }>Hello</ReactyOne>'
  }
}
// @ts-ignore
PluginsModelRoot.register('ModelRootWithPlugins');

//========== ||||||||||||||| =================================================================
export class PluginsViewRoot extends GameViewRoot {
  plugins={}
  constructor(model) {
    super(model);
    // #########  viewInits
    this.plugins['SynqVar_Mgr_View'] = new SynqVar_Mgr_View(model.plugins['SynqVar_Mgr_Model'])
    this.plugins['SynqClones_Mgr_View'] = new SynqClones_Mgr_View(model.plugins['SynqClones_Mgr_Model'])
    this.plugins['SynqCommand_Mgr_View'] = new SynqCommand_Mgr_View(model.plugins['SynqCommand_Mgr_Model'])
    // #########
  }
}