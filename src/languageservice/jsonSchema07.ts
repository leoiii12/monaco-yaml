/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export type JSONSchemaRef = JSONSchema | boolean;

export interface JSONSchema {
  id?: string;
  $id?: string;
  $schema?: string;
  type?: string | string[];
  title?: string;
  // tslint:disable-next-line: no-any
  default?: any;
  definitions?: { [name: string]: JSONSchema };
  description?: string;
  properties?: JSONSchemaMap;
  patternProperties?: JSONSchemaMap;
  additionalProperties?: boolean | JSONSchemaRef;
  minProperties?: number;
  maxProperties?: number;
  dependencies?: JSONSchemaMap | { [prop: string]: string[] };
  items?: JSONSchemaRef | JSONSchemaRef[];
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  additionalItems?: boolean | JSONSchemaRef;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean | number;
  exclusiveMaximum?: boolean | number;
  multipleOf?: number;
  required?: string[];
  $ref?: string;
  anyOf?: JSONSchemaRef[];
  allOf?: JSONSchemaRef[];
  oneOf?: JSONSchemaRef[];
  not?: JSONSchemaRef;
  // tslint:disable-next-line: no-any
  enum?: any[];
  format?: string;

  // schema draft 06
  // tslint:disable-next-line: no-any
  const?: any;
  contains?: JSONSchemaRef;
  propertyNames?: JSONSchemaRef;
  // tslint:disable-next-line: no-any
  examples?: any[];

  // schema draft 07
  $comment?: string;
  if?: JSONSchemaRef;
  then?: JSONSchemaRef;
  else?: JSONSchemaRef;

  // VSCode extensions

  defaultSnippets?: {
    label?: string;
    description?: string;
    markdownDescription?: string;
    // tslint:disable-next-line: no-any
    body?: any;
    bodyText?: string;
  }[]; // VSCode extension: body: a object that will be converted to a JSON string. bodyText: text with \t and \n

  errorMessage?: string; // VSCode extension
  patternErrorMessage?: string; // VSCode extension
  deprecationMessage?: string; // VSCode extension
  enumDescriptions?: string[]; // VSCode extension
  markdownEnumDescriptions?: string[]; // VSCode extension
  markdownDescription?: string; // VSCode extension
  doNotSuggest?: boolean; // VSCode extension
  allowComments?: boolean; // VSCode extension
}

export interface JSONSchemaMap {
  [name: string]: JSONSchemaRef;
}
