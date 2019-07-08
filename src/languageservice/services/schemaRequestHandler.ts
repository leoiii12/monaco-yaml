import { URI } from 'vscode-uri';
import { IConnection } from 'vscode-languageserver';
import { xhr, XHRResponse, getErrorStatusDescription } from 'request-light';

import {
  VSCodeContentRequest,
  CustomSchemaContentRequest,
} from '../../requestTypes';
import { isRelativePath, relativeToAbsolutePath } from '../utils/paths';

/**
 * Handles schema content requests given the schema URI
 * @param uri can be a local file, vscode request, http(s) request or a custom request
 */
export const schemaRequestHandler = (
  connection: IConnection,
  uri: string
): Thenable<string> => {
  if (!uri) {
    return Promise.reject('No schema specified');
  }

  // If the requested schema URI is a relative file path
  // Convert it into a proper absolute path URI
  if (isRelativePath(uri)) {
    uri = relativeToAbsolutePath(
      this.workspaceFolders,
      this.workspaceRoot,
      uri
    );
  }

  const scheme = URI.parse(uri).scheme.toLowerCase();

  // vscode schema content requests are forwarded to the client through LSP
  // This is a non-standard LSP extension introduced by the JSON language server
  // See https://github.com/microsoft/vscode/blob/master/extensions/json-language-features/server/README.md
  if (scheme === 'vscode') {
    return connection
      .sendRequest(VSCodeContentRequest.type, uri)
      .then(responseText => responseText, error => error.message);
  }

  // HTTP(S) requests are sent and the response result is either the schema content or an error
  if (scheme === 'http' || scheme === 'https') {
    // If it's an HTTP(S) request to Microsoft Azure, log the request
    if (uri.indexOf('//schema.management.azure.com/') !== -1) {
      connection.telemetry.logEvent({
        key: 'json.schema',
        value: {
          schemaURL: uri,
        },
      });
    }

    // Send the HTTP(S) schema content request and return the result
    const headers = { 'Accept-Encoding': 'gzip, deflate' };
    return xhr({ url: uri, followRedirects: 5, headers }).then(
      response => response.responseText,
      (error: XHRResponse) =>
        Promise.reject(
          error.responseText ||
            getErrorStatusDescription(error.status) ||
            error.toString()
        )
    );
  }

  // Neither local file nor vscode, nor HTTP(S) schema request, so send it off as a custom request
  return connection.sendRequest(
    CustomSchemaContentRequest.type,
    uri
  ) as Thenable<string>;
};
