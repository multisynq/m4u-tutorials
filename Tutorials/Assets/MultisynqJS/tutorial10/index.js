import { StartSession } from '@multisynq/m4u-package'
import { PluginsModelRoot, PluginsViewRoot } from './plugins/indexOfPlugins'
import { BUILD_IDENTIFIER } from './buildIdentifier'

StartSession(PluginsModelRoot, PluginsViewRoot, BUILD_IDENTIFIER)
