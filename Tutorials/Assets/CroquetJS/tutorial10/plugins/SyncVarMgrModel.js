
import { Model } from '@croquet/croquet';

export class SyncVarMgrModel extends Model {
  get gamePawnType() { return '' }
  init(options) {
    super.init(options)
    this.subscribe('SyncVar', 'set1', this.syncVarChange)
    console.log('### <color=magenta>SyncVarMgrModel.init() <<<<<<<<<<<<<<<<<<<<< </color>')
  }
  syncVarChange(msg) {
    console.log(`<color=blue>[SyncVar]</color> <color=yellow>JS</color> CroquetModel <color=magenta>SyncVarMgrModel.syncVarChange()</color> msg = <color=white>${JSON.stringify(msg)}</color>`)
    this.publish('SyncVar', 'set2', msg)
  }
}
SyncVarMgrModel.register('SyncVarMgrModel')
