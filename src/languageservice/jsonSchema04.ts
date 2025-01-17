/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

export interface JSONSchema {
  id?: string;
  $schema?: string;
  type?: string | string[];
  title?: string;
  // tslint:disable-next-line: no-any
  default?: any;
  definitions?: JSONSchemaMap;
  description?: string;
  properties?: JSONSchemaMap;
  patternProperties?: JSONSchemaMap;
  // tslint:disable-next-line: no-any
  additionalProperties?: any;
  minProperties?: number;
  maxProperties?: number;
  dependencies?: JSONSchemaMap | string[];
  // tslint:disable-next-line: no-any
  items?: any;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  additionalItems?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
  required?: string[];
  $ref?: string;
  anyOf?: JSONSchema[];
  allOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
  // tslint:disable-next-line: no-any
  enum?: any[];
  format?: string;
  errorMessage?: string; // VSCode extension
  patternErrorMessage?: string; // VSCode extension
  deprecationMessage?: string; // VSCode extension
  enumDescriptions?: string[]; // VSCode extension
}

export interface JSONSchemaMap {
  [name: string]: JSONSchema;
}
