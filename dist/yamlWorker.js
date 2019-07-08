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
})({"gfGO":[function(require,module,exports) {
var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "vscode-languageserver-types", "./languageservice/parser/yamlParser04", "./languageservice/parser/yamlParser07", "./languageservice/yamlLanguageService", "vscode-json-languageservice"], factory);
  }
})(function (require, exports) {
  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Red Hat, Inc. All rights reserved.
   *  Copyright (c) Adam Voss. All rights reserved.
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const ls = __importStar(require("vscode-languageserver-types"));

  const yamlParser = __importStar(require("./languageservice/parser/yamlParser04"));

  const yamlParser2 = __importStar(require("./languageservice/parser/yamlParser07"));

  const yamlService = __importStar(require("./languageservice/yamlLanguageService"));

  const jsonService = __importStar(require("vscode-json-languageservice"));

  let defaultSchemaRequestService;

  if (typeof fetch !== 'undefined') {
    defaultSchemaRequestService = function (url) {
      return fetch(url).then(response => response.text());
    };
  }

  class YAMLWorker {
    constructor(ctx, createData) {
      this._ctx = ctx;
      this._languageSettings = createData.languageSettings;
      this._languageId = createData.languageId;
      this._languageService = yamlService.getLanguageService(createData.enableSchemaRequest && defaultSchemaRequestService, null, []);
      this._jsonlanguageService = jsonService.getLanguageService({
        schemaRequestService: createData.enableSchemaRequest && defaultSchemaRequestService
      });

      this._languageService.configure(Object.assign({}, this._languageSettings, {
        hover: true,
        isKubernetes: true
      }));
    }

    doValidation(uri) {
      const document = this._getTextDocument(uri);

      if (document) {
        const yamlDocument = yamlParser2.parse(document.getText());
        return this._languageService.doValidation(this._jsonlanguageService, document, yamlDocument, false);
      }

      return Promise.resolve([]);
    }

    doComplete(uri, position) {
      const document = this._getTextDocument(uri);

      const yamlDocument = yamlParser.parse(document.getText());
      return this._languageService.doComplete(document, position, yamlDocument);
    }

    doResolve(item) {
      return this._languageService.doResolve(item);
    }

    doHover(uri, position) {
      const document = this._getTextDocument(uri);

      const yamlDocument = yamlParser2.parse(document.getText());
      return this._languageService.doHover(this._jsonlanguageService, document, position, yamlDocument);
    }

    format(uri, range, options) {
      const document = this._getTextDocument(uri);

      const textEdits = this._languageService.doFormat(document, {
        enable: true
      });

      return Promise.resolve(textEdits);
    }

    resetSchema(uri) {
      return Promise.resolve(this._languageService.resetSchema(uri));
    }

    findDocumentSymbols(uri) {
      const document = this._getTextDocument(uri);

      const yamlDocument = yamlParser2.parse(document.getText());

      const symbols = this._languageService.findDocumentSymbols2(this._jsonlanguageService, document, yamlDocument);

      return Promise.resolve(symbols);
    }

    findDocumentColors(uri) {
      const document = this._getTextDocument(uri);

      const stylesheet = yamlParser2.parse(document.getText());

      const colorSymbols = this._languageService.findDocumentColors(this._jsonlanguageService, document, stylesheet);

      return Promise.resolve(colorSymbols);
    }

    getColorPresentations(uri, color, range) {
      const document = this._getTextDocument(uri);

      const stylesheet = yamlParser2.parse(document.getText());

      const colorPresentations = this._languageService.getColorPresentations(this._jsonlanguageService, document, stylesheet, color, range);

      return Promise.resolve(colorPresentations);
    }

    _getTextDocument(uri) {
      const models = this._ctx.getMirrorModels();

      for (const model of models) {
        if (model.uri.toString() === uri) {
          return ls.TextDocument.create(uri, this._languageId, model.version, model.getValue());
        }
      }

      return null;
    }

  }

  exports.YAMLWorker = YAMLWorker;

  function create(ctx, createData) {
    return new YAMLWorker(ctx, createData);
  }

  exports.create = create;
});
},{}]},{},["gfGO"], null)
//# sourceMappingURL=/yamlWorker.js.map