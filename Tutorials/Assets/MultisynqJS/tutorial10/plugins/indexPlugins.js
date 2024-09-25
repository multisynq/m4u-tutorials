import { GameModelRoot } from '@croquet/game-models';
import { GameViewRoot } from '@croquet/unity-bridge';
// ########
// [[ImportStatements]]
import { SynqClones_Mgr_Model } from './SynqClones_Mgr_Model'
import { SynqCommand_Mgr_Model } from './SynqCommand_Mgr_Model'
import { SynqVar_Mgr_Model } from './SynqVar_Mgr_Model'
// ########

export class ModelRootWithPlugins extends GameModelRoot {
  
  init(options) {
    // @ts-ignore
    super.init(options);
    // ########
    SynqClones_Mgr_Model.create({})
    SynqCommand_Mgr_Model.create({})
    SynqVar_Mgr_Model.create({})
    // ########
  }
}
// @ts-ignore
ModelRootWithPlugins.register('ModelRootWithPlugins');
//--------------------------------------------------------------------------------------------
//========== ||||||||||||||||||| =================================================================
export class ViewRootWithPlugins extends GameViewRoot {
  plugins={}
  constructor(model) {
    super(model);
    // console.log(`### PluginsViewRoot.constructor() ${JSON.stringify(globalPluginModules)}`);
    // const viewExports = allExportsOfModulesExtendingClass(globalPluginModules, View);
    
    // console.log('$$$$',{model});
    // viewExports.forEach(exp => {
    //   console.log(`### Plugin '${exp.name}' correctly extends Croquet.View`);
    //   // this[`__${exp.name}`] = exp.value.create(this[`__${exp.name}`]);
    //   // make a new using new exp.value(this[`__${exp.name}`])
    //   const pluginModel = model.plugins[exp.moduleNm];
    //   console.log(`### Plugin '${exp.name}' model: ${pluginModel}`);
    //   this.plugins[exp.modelNm] = new exp.klass(pluginModel);
    // });
  }
}
