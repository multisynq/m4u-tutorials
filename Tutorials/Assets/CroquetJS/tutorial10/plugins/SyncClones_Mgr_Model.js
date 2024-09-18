import { Model, View } from '@croquet/croquet';

export class SyncClones_Mgr_Model extends Model {
  init(options) {
    super.init(options);
    this.subscribe('SyncClone', 'askToClone', this.onAskForInstance);
    console.log('<color=yellow>[JS]</color> <color=magenta>SyncClones_Mgr_Model.init()</color>');
  }
  
  onAskForInstance(data) {
    console.log('<color=blue>SyncClone</color> <color=yellow>[JS]</color> <color=magenta>SyncClones_Mgr_Model.onAskForInstance()</color><color=cyan>' + data + '</color>');
    this.publish('SyncClone', 'tellToClone', data);
  }
}
SyncClones_Mgr_Model.register('SyncClones_Mgr_Model');

export class SyncClones_Mgr_View extends View {
  constructor(model) {
    super(model);
    this.model = model;
  }
}
    