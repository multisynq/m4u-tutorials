import { Model, View } from '@croquet/croquet';
        
export class SyncVar_Mgr_Model extends Model {
  get gamePawnType() { return '' }

  varValuesAsMessages = []

  init(options) {
    super.init(options)
    this.subscribe('SyncVar', 'setVar', this.syncVarChange) // sent from Unity to JS
    console.log('### <color=magenta>SyncVar_Mgr_Model.init() <<<<<<<<<<<<<<<<<<<<< </color>')
  }

  
  syncVarChange(msg) {

    // store the value in the array at the index specified in the message
    const varIdx = parseInt(msg.split('|')[0])
    this.varValuesAsMessages[varIdx] = msg

    // TODO: remove this logging once broadly in use (it will SPAM the console)
    console.log(`${this.now()} <color=blue>[SyncVar]</color> <color=yellow>JS</color> CroquetModel <color=magenta>SyncVarMgrModel.syncVarChange()</color> msg = <color=white>${JSON.stringify(msg)}</color>`)
    this.publish('SyncVar', 'varChanged', msg) // sent from JS to Unity
  }
}
SyncVar_Mgr_Model.register('SyncVar_Mgr_Model')
      

export class SyncVar_Mgr_View extends View {
  constructor(model) {
    super(model)
    console.log('### <color=green>SyncVar_Mgr_View.constructor() <<<<<<<<<<<<<<<<<<<<< </color>')
    this.model = model
    // Initially Send All Values
    const messages = model.varValuesAsMessages.map((msg) => {
      // MIMICS  model.publish('SyncVar', 'varChanged', msg) // sent from JS to Unity
      // TODO: cleanup
      const command = 'croquetPub'
      const args = ['SyncVar', 'varChanged', msg]
      return [command, ...args].join('\x01')
    })
    globalThis.theGameEngineBridge.sendBundleToUnity(messages)
  }
}

