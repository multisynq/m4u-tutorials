import { StartSession } from '@croquet/unity-bridge'
import { PluginsModelRoot, PluginsViewRoot } from './plugins/indexOfPlugins'
import { BUILD_IDENTIFIER } from './buildIdentifier'

StartSession(PluginsModelRoot, PluginsViewRoot, BUILD_IDENTIFIER)
