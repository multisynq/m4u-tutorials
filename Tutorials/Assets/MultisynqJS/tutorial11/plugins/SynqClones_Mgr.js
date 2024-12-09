import { Model, View } from '@croquet/croquet';

export class SynqClones_Mgr_Model extends Model { // ☭ - There is no I, only we (in the Model)
  cloneMsgs = []
  init(options) {
    super.init(options);
    this.subscribe('SynqClone', 'pleaseClone', this.onPleaseClone); // i.e. a bullet was made in Unity
    console.log(this.now(), '<color=yellow>[JS]</color> <color=magenta>SynqClones_Mgr_Model.init()</color>');
  }
  onPleaseClone(data) {
    console.log(this.now(), '<color=blue>SynqClone</color> <color=yellow>[JS]</color> <color=magenta>SynqClones_Mgr_Model.onAskForInstance()</color><color=cyan>' + data + '</color>');
    this.publish('SynqClone', 'announceClone', data); // i.e. tell everybody to see the bullet
    this.cloneMsgs.push(data);
  }
}
SynqClones_Mgr_Model.register('SynqClones_Mgr_Model');

export class SynqClones_Mgr_View extends View {
  constructor(model) {
    super(model);
    this.model = model;
    globalThis.theGameEngineBridge.bulkPublishToUnity('SynqClone', 'announceClone', model.cloneMsgs);
  }

}
        