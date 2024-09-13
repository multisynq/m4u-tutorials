import { GameModelRoot } from '@croquet/game-models';
import { Model } from '@croquet/croquet';

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

//--------------------------------------------------------------------------------------------
(function() { // <<<< An Immediately Invoked Function Expression (IIFE)
  console.log(`### >>>>> Importing plugins/*.js`);
  webpackImportPluginJsFiles();
})(); //         <<<< An Immediately Invoked Function Expression (IIFE)

//--------------------------------------------------------------------------------------------
//========== |||||||||||||||||||| =================================================================
export class ModelRootWithPlugins extends GameModelRoot {
  init(options) {
    // @ts-ignore
    super.init(options);
    console.log(`### ModelRootWithPlugins.init() ${JSON.stringify(globalPluginModules)}`);
    
    // Create proxy instances and assign them to this
    Object.keys(globalPluginModules).forEach((name) => {
      const module = globalPluginModules[name];
      console.log(`### ---- module = globalPluginModules[<color=cyan>${name}</color>] --- w/ typeof ${typeof module}`);
      inspectPlugin(module);
      
      let PluginClass;
      
      if (typeof module === 'function' && isClass(module)) {
        PluginClass = module;
        console.log('### module is directly a class');
      } else if (typeof module === 'object' && module !== null) {
        console.log('### module is an object');
        if (typeof module.default === 'function' && isClass(module.default)) {
          PluginClass = module.default;
          console.log('### module.default is a class');
        } else {
          // Search for a class in the module
          const classKey = Object.keys(module).find(key => isClass(module[key]));
          if (classKey) {
            PluginClass = module[classKey];
            console.log(`### Found class in module: ${classKey}`);
          } else {
            console.log(`### No class found in module '${name}'`);
            return;
          }
        }
      } else {
        console.log(`### Exported '${name}' is not a valid plugin`);
        return;
      }

      console.log(`### ----------- Creating instance of plugin '${name}' ---------`);

      // check if PluginClass extends Croquet.Model
      if (!(PluginClass.prototype instanceof Model)) { // as in Croquet Model
        console.error(`### Plugin '${name}' does not extend Croquet.Model`);
        return;
      } else {
        console.log(`### Plugin '${name}' correctly extends Croquet.Model`);
        // call create() if it exists
        if (typeof PluginClass.create === 'function') {
          console.log(`### 'plugins/${PluginClass.name}.js' has static ${PluginClass.name}.create() function`);
          this[`__${name}`] = PluginClass.create();
        } else {
          console.error(`### Plugin '${name}' extends Croquet.Model, but it lacks a .create() function!!`);
        }
      }
      
    });
  }
}


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