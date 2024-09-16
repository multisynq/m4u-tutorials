import { GameModelRoot } from '@croquet/game-models';
import { Model, View } from '@croquet/croquet';
import { GameViewRoot } from '@croquet/unity-bridge';

//--------------------------------------------------------------------------------------------
// Object to store plugin modules
const globalPluginModules = {};
//--------------------------------------------------------------------------------------------
const webpackImportPluginJsFiles = () => { // a top-scope function for webpack to load plugins
  // Webpack require all:  plugins/*.js (prevent loading myself)
  // @ts-ignore
  const webpackLoader = require.context('./plugins', true, /^\.\/[^.]+(?<!ModelRootWithPlugins)\.js$/);
  
  return webpackLoader.keys()
    .filter(moduleNm => {
      const fullPath = webpackLoader.resolve(moduleNm); // Use resolve to get the full path
      const hasJsExt = fullPath.endsWith('.js') // Check if the resolved path ends with .js
      const isNotMyself = !fullPath.includes('ModelRootWithPlugins.js'); // Exclude this file
      console.log(`### ${(hasJsExt)?'(Not .js)':'(Yes .js)'} Checking plugin: ${fullPath} `);
      return hasJsExt && isNotMyself; 
    })
    .forEach(moduleNm => {
      // Log the valid plugin being loaded
      console.log(`### Loading plugin: ${moduleNm}`);
      //                        vvv
      const loadedModule = webpackLoader(moduleNm); // IMPORT one plugin/*.js file < < < < < < < < 
      //                        ^^^
      globalPluginModules[moduleNm] = loadedModule; // Store the plugin in the global object
    });
};

function allExportsOfModules(modules) {
  const exports = [];

  Object.values(modules).forEach(module => {
    if (typeof module === 'function' && isClass(module)) {
      exports.push({ type: 'class', moduleNm: module.name, value: module });
    } else if (typeof module === 'object' && module !== null) {
      Object.entries(module).forEach(([key, klass]) => {
        if (isClass(klass)) {
          exports.push({ type: 'class', moduleNm:module.name, klassName: key, klass });
        } else if (typeof klass === 'function') {
          exports.push({ type: 'function', moduleNm:module.name, funcName: key, func: klass });
        }
      });
    }
  });

  return exports;
}

function allExportsOfModulesExtendingClass(modules, klass) {
  return allExportsOfModules(modules).filter(exprt => exprt.type === 'class' && exprt.klass.prototype instanceof klass);
}

//--------------------------------------------------------------------------------------------
(function() { // <<<< An Immediately Invoked Function Expression (IIFE)
  console.log(`### >>>>> Importing plugins/*.js`);
  webpackImportPluginJsFiles();
})(); //         <<<< An Immediately Invoked Function Expression (IIFE)

//--------------------------------------------------------------------------------------------
//========== |||||||||||||||||||| =================================================================
export class ModelRootWithPlugins extends GameModelRoot {

  plugins={}

  init(options) {
    // @ts-ignore
    super.init(options);
    console.log(`### ModelRootWithPlugins.init() ${JSON.stringify(globalPluginModules)}`);
    const modelExports = allExportsOfModulesExtendingClass(globalPluginModules, Model);
    // const viewExports = allExportsOfModulesExtendingClass(globalPluginModules, View);
    
    modelExports.forEach(exprt => {
      console.log(`### Plugin '${exprt.name}' correctly extends Croquet.Model`);
      this.plugins[exprt.moduleNm] = exprt.klass.create();
    });
    
  }
}
// @ts-ignore
ModelRootWithPlugins.register('ModelRootWithPlugins');
//--------------------------------------------------------------------------------------------
//========== ||||||||||||||||||| =================================================================
export class ViewRootWithPlugins extends GameViewRoot {
  plugins={}
  constructor(model) {
    super(model);
    console.log(`### PluginsViewRoot.constructor() ${JSON.stringify(globalPluginModules)}`);
    const viewExports = allExportsOfModulesExtendingClass(globalPluginModules, View);
    
    console.log('$$$$',{model});
    viewExports.forEach(exp => {
      console.log(`### Plugin '${exp.name}' correctly extends Croquet.View`);
      // this[`__${exp.name}`] = exp.value.create(this[`__${exp.name}`]);
      // make a new using new exp.value(this[`__${exp.name}`])
      const pluginModel = model.plugins[exp.moduleNm];
      console.log(`### Plugin '${exp.name}' model: ${pluginModel}`);
      this.plugins[exp.modelNm] = new exp.klass(pluginModel);
    });
  }
}


// === Helper functions ========================================================================
// === Helper functions ========================================================================
// === Helper functions ========================================================================
// === Helper functions ========================================================================
const inspectPlugin = (plugin) => {
  console.log('Plugin contents:');
  Object.keys(plugin).forEach(key => {
    const item = plugin[key];
    if (typeof item === 'function') {
      if (isClass(item)) {
        console.log(`###  Class: ${key}`);
        inspectClass(item);
      } else {
        console.log(`###  Function: ${key}`);
      }
    } else if (typeof item === 'object' && item !== null) {
      console.log(`###  Object: ${key}`);
      inspectObject(item);
    }
  });
};

const isClass = (func) => {
  return typeof func === 'function' 
    && /^class\s/.test(Function.prototype.toString.call(func));
};

const inspectClass = (cls) => {
  // Instance methods
  const prototype = cls.prototype;
  Object.getOwnPropertyNames(prototype).forEach(name => {
    console.log(`###    Instance Method: '${name}()' of type ${typeof prototype[name]}`);
  });
  
  // Static methods and properties
  Object.getOwnPropertyNames(cls).forEach(name => {
    if (name !== 'prototype' && name !== 'length' && name !== 'name') {
      const descriptor = Object.getOwnPropertyDescriptor(cls, name);
      if (descriptor && descriptor.value && typeof descriptor.value === 'function') {
        console.log(`###    Static Method: ${name}`);
      } else if (descriptor && (descriptor.get || descriptor.set)) {
        console.log(`###    Static Property (getter/setter): ${name}`);
      } else {
        console.log(`###    Static Property: ${name}`);
      }
    }
  });
};

const inspectObject = (obj) => {
  Object.keys(obj).forEach(key => {
    const item = obj[key];
    if (typeof item === 'function') {
      console.log(`###    Method: ${key}`);
    } else {
      console.log(`###    Property: ${key}`);
    }
  });
};