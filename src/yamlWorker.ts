/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Adam Voss. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import Thenable = monaco.Thenable;
import IWorkerContext = monaco.worker.IWorkerContext;

import * as ls from 'vscode-languageserver-types';
import * as yamlParser07 from './languageservice/parser/yamlParser07';
import * as yamlService from './languageservice/yamlLanguageService';
import * as jsonService from 'vscode-json-languageservice';

let defaultSchemaRequestService;
if (typeof fetch !== 'undefined') {
  defaultSchemaRequestService = function(url) {
    return fetch(url).then(response => response.text());
  };
}

export class YAMLWorker {
  private _ctx: IWorkerContext;
  private _languageService: yamlService.LanguageService;
  private _languageSettings: yamlService.LanguageSettings;
  private _jsonlanguageService: jsonService.LanguageService;
  private _languageId: string;

  constructor(ctx: IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this._languageSettings = createData.languageSettings;
    this._languageId = createData.languageId;
    this._languageService = yamlService.getLanguageService(
      createData.enableSchemaRequest && defaultSchemaRequestService,
      null,
      []
    );
    this._jsonlanguageService = jsonService.getLanguageService({
      schemaRequestService:
        createData.enableSchemaRequest && defaultSchemaRequestService,
    });
    this._languageService.configure({
      ...this._languageSettings,
      hover: true,
      isKubernetes: true,
    });
  }

  public doValidation(uri: string): Thenable<ls.Diagnostic[]> {
    const document = this._getTextDocument(uri);
    if (document) {
      const yamlDocument = yamlParser07.parse(document.getText());
      return this._languageService.doValidation(
        this._jsonlanguageService,
        document,
        yamlDocument,
        false
      );
    }
    return Promise.resolve([]);
  }

  public doComplete(
    uri: string,
    position: ls.Position
  ): Thenable<ls.CompletionList> {
    const document = this._getTextDocument(uri);
    const yamlDocument = yamlParser07.parse(document.getText());
    return this._languageService.doComplete(document, position, yamlDocument);
  }

  public doResolve(item: ls.CompletionItem): Thenable<ls.CompletionItem> {
    return this._languageService.doResolve(item);
  }

  public doHover(uri: string, position: ls.Position): Thenable<ls.Hover> {
    const document = this._getTextDocument(uri);
    const yamlDocument = yamlParser07.parse(document.getText());
    return this._languageService.doHover(
      this._jsonlanguageService,
      document,
      position,
      yamlDocument
    );
  }

  public format(
    uri: string,
    range: ls.Range,
    options: ls.FormattingOptions
  ): Thenable<ls.TextEdit[]> {
    const document = this._getTextDocument(uri);
    const textEdits = this._languageService.doFormat(document, {
      enable: true,
    });
    return Promise.resolve(textEdits);
  }

  public resetSchema(uri: string): Thenable<boolean> {
    return Promise.resolve(this._languageService.resetSchema(uri));
  }

  public findDocumentSymbols(uri: string): Thenable<ls.SymbolInformation[]> {
    const document = this._getTextDocument(uri);
    const yamlDocument = yamlParser07.parse(document.getText());
    const symbols = this._languageService.findDocumentSymbols2(
      this._jsonlanguageService,
      document,
      yamlDocument
    );
    return Promise.resolve(symbols);
  }
  public findDocumentColors(uri: string): Thenable<ls.ColorInformation[]> {
    const document = this._getTextDocument(uri);
    const stylesheet = yamlParser07.parse(document.getText());
    const colorSymbols = this._languageService.findDocumentColors(
      this._jsonlanguageService,
      document,
      stylesheet
    );
    return Promise.resolve(colorSymbols);
  }
  public getColorPresentations(
    uri: string,
    color: ls.Color,
    range: ls.Range
  ): Thenable<ls.ColorPresentation[]> {
    const document = this._getTextDocument(uri);
    const stylesheet = yamlParser07.parse(document.getText());
    const colorPresentations = this._languageService.getColorPresentations(
      this._jsonlanguageService,
      document,
      stylesheet,
      color,
      range
    );
    return Promise.resolve(colorPresentations);
  }

  private _getTextDocument(uri: string): ls.TextDocument {
    const models = this._ctx.getMirrorModels();
    for (const model of models) {
      if (model.uri.toString() === uri) {
        return ls.TextDocument.create(
          uri,
          this._languageId,
          model.version,
          model.getValue()
        );
      }
    }
    return null;
  }
}

export interface ICreateData {
  languageId: string;
  languageSettings: yamlService.LanguageSettings;
  enableSchemaRequest: boolean;
}

export function create(
  ctx: IWorkerContext,
  createData: ICreateData
): YAMLWorker {
  return new YAMLWorker(ctx, createData);
}
