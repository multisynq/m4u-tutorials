import { Model } from '@croquet/croquet';
        
export class SyncCommand_Mgr_Model extends Model {
    init(options) {
        super.init(options);
        this.subscribe('SyncCommand', 'execute1', this.onSyncCommandExecute);
        console.log('### <color=magenta>SyncCommand_Mgr_Model.init() <<<<<<<<<<<<<<<<<<<<< </color>');
    }
    onSyncCommandExecute(msg) {
        console.log(`<color=blue>[SyncCommand]</color> <color=yellow>JS</color> CroquetModel <color=magenta>SyncCommandMgrModel.onSyncCommandExecute()</color> msg = <color=white>${JSON.stringify(msg)}</color>`);
        this.publish('SyncCommand', 'execute2', msg);
    }
}
SyncCommand_Mgr_Model.register('SyncCommandMgrModel');
      