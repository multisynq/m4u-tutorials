import { Model, View } from '@croquet/croquet';

export class SynqClones_Mgr_Model extends Model {
  cloneMsgs = []
  init(options) {
    super.init(options);
    this.subscribe('SynqClone', 'pleaseClone', this.onPleaseClone);
    console.log('<color=yellow>[JS]</color> <color=magenta>SynqClones_Mgr_Model.init()</color>');
  }
  
  onPleaseClone(data) {
    console.log('<color=blue>SynqClone</color> <color=yellow>[JS]</color> <color=magenta>SynqClones_Mgr_Model.onAskForInstance()</color><color=cyan>' + data + '</color>');
    this.publish('SynqClone', 'everybodyClone', data);
    cloneMsgs.push(data);
  }
}
SynqClones_Mgr_Model.register('SynqClones_Mgr_Model');

export class SynqClones_Mgr_View extends View {
  constructor(model) {
    super(model);
    this.model = model;
    model.cloneMsgs.forEach(msg => model.onPleaseClone(msg));
  }
}
        