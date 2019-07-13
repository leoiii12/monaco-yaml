'use strict';

import {
  TextDocument,
  SymbolInformation,
  Position,
} from 'vscode-languageserver-types';
import { parse as parseYAML } from '../parser/yamlParser07';
import { YAMLDocumentSymbols } from './documentSymbols';
import { matchOffsetToDocument } from '../utils/arrUtils';
import { PropertyASTNode, StringASTNode } from '../jsonASTTypes';

export class YAMLDefFinder {
  private documentSymbols: YAMLDocumentSymbols;

  constructor(documentSymbols: YAMLDocumentSymbols) {
    this.documentSymbols = documentSymbols;
  }

  public findDefinitions(
    document: TextDocument,
    position: Position
  ): SymbolInformation[] {
    const doc = parseYAML(document.getText());
    if (!doc || doc['documents'].length === 0) {
      return null;
    }

    const offset = document.offsetAt(position);
    const currentDoc = matchOffsetToDocument(offset, doc);

    const node = currentDoc.getNodeFromOffset(offset);
    if (
      !node ||
      node.type !== 'string' ||
      ((node as unknown) as StringASTNode).value === '$ref' ||
      !node.parent ||
      node.parent.type !== 'property'
    ) {
      return null;
    }

    const propertyNode = (node.parent as unknown) as PropertyASTNode;
    const keyNode = propertyNode.keyNode;
    const valueNode = propertyNode.valueNode;

    if (
      !keyNode.value ||
      keyNode.value.toString() !== '$ref' ||
      !valueNode.value ||
      valueNode.value.toString().startsWith('#/definitions/') === false
    ) {
      return null;
    }

    const def = valueNode.value.toString().replace('#/definitions/', '');

    const documentSymbols = this.documentSymbols.findDocumentSymbols(document);
    const matchedSymbols = documentSymbols.filter(item => {
      return item.name === def;
    });

    return matchedSymbols;
  }
}
