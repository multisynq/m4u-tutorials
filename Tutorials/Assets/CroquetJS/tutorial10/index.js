import { StartSession, GameViewRoot } from '@croquet/unity-bridge';
import { GameModelRootWithPlugins } from './GameModelRootWithPlugins';    

export class MyModelRoot extends GameModelRootWithPlugins {
  async init(options) {
    super.init(options);
  }
}
MyModelRoot.register('MyModelRoot');

StartSession(MyModelRoot, GameViewRoot);