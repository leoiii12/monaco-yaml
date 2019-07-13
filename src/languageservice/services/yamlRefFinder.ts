'use strict';

import {
  TextDocument,
  SymbolInformation,
  Position,
} from 'vscode-languageserver-types';
import { parse as parseYAML } from '../parser/yamlParser07';
import { YAMLDocumentSymbols } from './documentSymbols';
import { matchOffsetToDocument } from '../utils/arrUtils';
import { StringASTNode, ASTNode, PropertyASTNode } from '../jsonASTTypes';

export class YAMLRefFinder {
  private documentSymbols: YAMLDocumentSymbols;

  constructor(documentSymbols: YAMLDocumentSymbols) {
    this.documentSymbols = documentSymbols;
  }

  public isDefinition(node: ASTNode) {
    if (
      node.type !== 'string' ||
      node.parent === null ||
      node.parent.type !== 'property' ||
      node.parent.parent === null ||
      node.parent.parent.type !== 'object' ||
      node.parent.parent.parent === null ||
      node.parent.parent.parent.type !== 'property' ||
      node.parent.parent.parent.keyNode.value !== 'definitions'
    ) {
      return false;
    }

    return true;
  }

  public findReferences(
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
      !node.parent ||
      node.parent.type !== 'property'
    ) {
      return null;
    }

    const isDefinition = this.isDefinition(node);
    if (isDefinition === false) {
      return null;
    }

    const definition = node as StringASTNode;
    const ref = `#/definitions/${definition.value}`;

    const documentSymbols = this.documentSymbols.findDocumentSymbols(document);
    const matchedSymbols = documentSymbols
      .filter(item => {
        return item.name === '$ref';
      })
      .filter(item => {
        const node = currentDoc.getNodeFromOffset(
          document.offsetAt(item.location.range.start)
        );
        const value = (node.parent as PropertyASTNode).valueNode.value;

        return value === ref;
      });

    return matchedSymbols;
  }
}
