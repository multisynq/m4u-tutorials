import { StartSession } from '@croquet/unity-bridge'
import { ModelRootWithPlugins, ViewRootWithPlugins } from './plugins/indexPlugins'
import { BUILD_IDENTIFIER } from './buildIdentifier'

StartSession(ModelRootWithPlugins, ViewRootWithPlugins, BUILD_IDENTIFIER)
