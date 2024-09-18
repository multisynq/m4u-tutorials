import { Model, View } from '@croquet/croquet';
//---------- ||||||||||||||||| -------------------
export class SyncVar_Mgr_Model extends Model {
  varValuesAsMessages = []
  get gamePawnType() { return '' }

  init(options) {
    super.init(options)
    this.subscribe('SyncVar', 'setVar', this.syncVarChange) // sent from Unity to JS
    console.log('### <color=magenta>SyncVar_Mgr_Model.init() <<<<<<<<<<<<<<<<<<<<< </color>')
  }

  syncVarChange(msg) {
    const varIdx = parseInt(msg.split('|')[0])
    this.varValuesAsMessages[varIdx] = msg // store the value in the array at the index specified in the message
    this.publish('SyncVar', 'varChanged', msg) // sent from JS to Unity
  }
}
SyncVar_Mgr_Model.register('SyncVar_Mgr_Model')
      
//---------- |||||||||||||||| -------------------
export class SyncVar_Mgr_View extends View {
  constructor(model) {
    super(model)
    this.model = model
    console.log('### <color=green>SyncVar_Mgr_View.constructor() <<<<<<<<<<<<<<<<<<<<< </color>')
    const messages = model.varValuesAsMessages.map( (msg) => (
      `croquetPub\x01SyncVar\x01varChanged\x01${msg}`
    ))
    globalThis.theGameEngineBridge.sendBundleToUnity(messages) // MIMICS  model.publish('SyncVar', 'varChanged', msg)
  }
}
      