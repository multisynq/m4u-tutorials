import { StartSession, GameViewRoot } from '@croquet/unity-bridge';
import { ModelRootWithPlugins } from './ModelRootWithPlugins';    

export class MyModelRoot extends ModelRootWithPlugins {
  async init(options) {
    super.init(options);
  }
}
//@ts-ignore
MyModelRoot.register('MyModelRoot');

StartSession(MyModelRoot, GameViewRoot);