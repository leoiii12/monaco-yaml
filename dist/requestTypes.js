// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"YOsD":[function(require,module,exports) {
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "vscode-languageserver"], factory);
  }
})(function (require, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const vscode_languageserver_1 = require("vscode-languageserver");

  var SchemaAssociationNotification;

  (function (SchemaAssociationNotification) {
    SchemaAssociationNotification.type = new vscode_languageserver_1.NotificationType('json/schemaAssociations');
  })(SchemaAssociationNotification = exports.SchemaAssociationNotification || (exports.SchemaAssociationNotification = {}));

  var DynamicCustomSchemaRequestRegistration;

  (function (DynamicCustomSchemaRequestRegistration) {
    DynamicCustomSchemaRequestRegistration.type = new vscode_languageserver_1.NotificationType('yaml/registerCustomSchemaRequest');
  })(DynamicCustomSchemaRequestRegistration = exports.DynamicCustomSchemaRequestRegistration || (exports.DynamicCustomSchemaRequestRegistration = {}));

  var VSCodeContentRequest;

  (function (VSCodeContentRequest) {
    VSCodeContentRequest.type = new vscode_languageserver_1.RequestType('vscode/content');
  })(VSCodeContentRequest = exports.VSCodeContentRequest || (exports.VSCodeContentRequest = {}));

  var CustomSchemaContentRequest;

  (function (CustomSchemaContentRequest) {
    CustomSchemaContentRequest.type = new vscode_languageserver_1.RequestType('custom/schema/content');
  })(CustomSchemaContentRequest = exports.CustomSchemaContentRequest || (exports.CustomSchemaContentRequest = {}));

  var CustomSchemaRequest;

  (function (CustomSchemaRequest) {
    CustomSchemaRequest.type = new vscode_languageserver_1.RequestType('custom/schema/request');
  })(CustomSchemaRequest = exports.CustomSchemaRequest || (exports.CustomSchemaRequest = {}));

  var ColorSymbolRequest;

  (function (ColorSymbolRequest) {
    ColorSymbolRequest.type = new vscode_languageserver_1.RequestType('json/colorSymbols');
  })(ColorSymbolRequest = exports.ColorSymbolRequest || (exports.ColorSymbolRequest = {}));
});
},{}]},{},["YOsD"], null)
//# sourceMappingURL=/requestTypes.js.map