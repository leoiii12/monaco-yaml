/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Adam Voss. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import 'regenerator-runtime/runtime';
import Thenable = monaco.Thenable;
import IWorkerContext = monaco.worker.IWorkerContext;

import {
  Diagnostic,
  Position,
  CompletionList,
  CompletionItem,
  Hover,
  Range,
  FormattingOptions,
  TextEdit,
  SymbolInformation,
  ColorInformation,
  Color,
  ColorPresentation,
  TextDocument,
} from 'vscode-languageserver-types';
import {
  LanguageService,
  LanguageSettings,
  getLanguageService,
} from './languageservice/yamlLanguageService';
import {
  LanguageService as JsonLanguageService,
  getLanguageService as getJsonLanguageService,
} from 'vscode-json-languageservice';

let defaultSchemaRequestService;
if (typeof fetch !== 'undefined') {
  defaultSchemaRequestService = function(url) {
    return fetch(url).then(response => response.text());
  };
}

export class YAMLWorker {
  private _ctx: IWorkerContext;
  private _languageService: LanguageService;
  private _languageSettings: LanguageSettings;
  private _jsonLanguageService: JsonLanguageService;
  private _languageId: string;

  constructor(ctx: IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this._languageSettings = createData.languageSettings;
    this._languageId = createData.languageId;
    this._languageService = getLanguageService(
      createData.enableSchemaRequest && defaultSchemaRequestService,
      null,
      []
    );
    this._jsonLanguageService = getJsonLanguageService({
      schemaRequestService:
        createData.enableSchemaRequest && defaultSchemaRequestService,
    });
    this._languageService.configure({
      ...this._languageSettings,
      hover: true,
      isKubernetes: true,
    });
  }

  public doValidation(uri: string): Thenable<Diagnostic[]> {
    const document = this._getTextDocument(uri);
    if (document) {
      return this._languageService.doValidation(document, true);
    }
    return Promise.resolve([]);
  }

  public doComplete(uri: string, position: Position): Thenable<CompletionList> {
    const document = this._getTextDocument(uri);
    return this._languageService.doComplete(document, position, true);
  }

  public doResolve(item: CompletionItem): Thenable<CompletionItem> {
    return this._languageService.doResolve(item);
  }

  public doHover(uri: string, position: Position): Thenable<Hover> {
    const document = this._getTextDocument(uri);
    return this._languageService.doHover(document, position);
  }

  public format(
    uri: string,
    range: Range,
    options: FormattingOptions
  ): Thenable<TextEdit[]> {
    const document = this._getTextDocument(uri);
    const textEdits = this._languageService.doFormat(document, {
      enable: true,
    });
    return Promise.resolve(textEdits);
  }

  public resetSchema(uri: string): Thenable<boolean> {
    return Promise.resolve(this._languageService.resetSchema(uri));
  }

  public findDocumentSymbols(uri: string): Thenable<SymbolInformation[]> {
    const document = this._getTextDocument(uri);
    const symbols = this._languageService.findDocumentSymbols(document);
    return Promise.resolve(symbols);
  }

  public findDocumentColors(uri: string): Thenable<ColorInformation[]> {
    const document = this._getTextDocument(uri);
    const colorSymbols = this._languageService.findDocumentColors(document);
    return Promise.resolve(colorSymbols);
  }

  public getColorPresentations(
    uri: string,
    color: Color,
    range: Range
  ): Thenable<ColorPresentation[]> {
    const document = this._getTextDocument(uri);
    const colorPresentations = this._languageService.getColorPresentations(
      document,
      color,
      range
    );
    return Promise.resolve(colorPresentations);
  }

  private _getTextDocument(uri: string): TextDocument {
    const models = this._ctx.getMirrorModels();
    for (const model of models) {
      if (model.uri.toString() === uri) {
        return TextDocument.create(
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
  languageSettings: LanguageSettings;
  enableSchemaRequest: boolean;
}

export function create(
  ctx: IWorkerContext,
  createData: ICreateData
): YAMLWorker {
  return new YAMLWorker(ctx, createData);
}
