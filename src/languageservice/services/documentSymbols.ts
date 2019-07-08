/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as Parser from '../parser/jsonParser07';

import {
  SymbolInformation,
  TextDocument,
  DocumentSymbol,
  Color,
  Range,
} from 'vscode-languageserver-types';
import { LanguageService } from 'vscode-json-languageservice';

export class YAMLDocumentSymbols {
  public findDocumentSymbols(
    jsonLanguageService: LanguageService,
    document: TextDocument,
    doc: Parser.JSONDocument
  ): SymbolInformation[] {
    if (!doc || doc['documents'].length === 0) {
      return null;
    }

    let results = [];
    for (const yamlDoc of doc['documents']) {
      if (yamlDoc.root) {
        results = results.concat(
          jsonLanguageService.findDocumentSymbols(document, yamlDoc)
        );
      }
    }

    return results;
  }

  public findHierarchicalDocumentSymbols(
    jsonLanguageService: LanguageService,
    document: TextDocument,
    doc: Parser.JSONDocument
  ): DocumentSymbol[] {
    if (!doc || doc['documents'].length === 0) {
      return null;
    }

    let results = [];
    for (const yamlDoc of doc['documents']) {
      if (yamlDoc.root) {
        results = results.concat(
          jsonLanguageService.findDocumentSymbols2(document, yamlDoc)
        );
      }
    }

    return results;
  }

  public findDocumentColors(
    jsonLanguageService: LanguageService,
    document: TextDocument,
    doc: Parser.JSONDocument
  ): DocumentSymbol[] {
    if (!doc || doc['documents'].length === 0) {
      return null;
    }

    let results = [];
    for (const yamlDoc of doc['documents']) {
      if (yamlDoc.root) {
        results = results.concat(
          jsonLanguageService.findDocumentColors(document, yamlDoc)
        );
      }
    }

    return results;
  }

  public getColorPresentations(
    jsonLanguageService: LanguageService,
    document: TextDocument,
    doc: Parser.JSONDocument,
    color: Color,
    range: Range
  ): DocumentSymbol[] {
    if (!doc || doc['documents'].length === 0) {
      return null;
    }

    let results = [];
    for (const yamlDoc of doc['documents']) {
      if (yamlDoc.root) {
        results = results.concat(
          jsonLanguageService.getColorPresentations(
            document,
            yamlDoc,
            color,
            range
          )
        );
      }
    }

    return results;
  }
}
