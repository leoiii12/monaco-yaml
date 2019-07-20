# @leoiii12/monaco-yaml

YAML language plugin for the Monaco Editor. It provides the following features when editing YAML files:
* Code completion, based on JSON schemas or by looking at similar objects in the same file
* Hovers, based on JSON schemas
* Validation: Syntax errors and schema validation
* Formatting
* Document Symbols
* Syntax highlighting
* Automatically load remote schema files (by enabling DiagnosticsOptions.enableSchemaRequest)
* Find and Goto $def
* Find references of $def

Schemas can also be provided by configuration. See [here](https://github.com/Microsoft/monaco-json/blob/master/src/monaco.d.ts)
for the API that the JSON plugin offers to configure the JSON language support.

## Installing

```html
<head>
  <link rel="stylesheet" data-name="vs/editor/editor.main" href="assets/monaco/vs/editor/editor.main.css" />

  <script src="assets/monaco/vs/loader.js"> </script>
  <script src="assets/monaco/vs/editor/editor.main.nls.js"> </script>
  <script src="assets/monaco/vs/editor/editor.main.js"> </script>
  <script src="assets/monaco/vs/basic-languages/monaco.contribution.js"> </script>

  <!-- @leoiii12/monaco-yaml -->
  <script src="assets/monaco/vs/language/yaml/monaco.contribution.js"> </script>
  <script>
    window.require.config({ paths: { 'vs': `assets/monaco/vs` } });
  </script>
</head>
```
```typescript

declare var monaco: typeof import('monaco-editor-core');

(monaco.languages as any).yaml.yamlDefaults.setDiagnosticsOptions({
  enableSchemaRequest: true,
  validate: true,
  hover: true,
  completion: true,
  format: true,
  schemas: [
    {
      uri: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json',
      fileMatch: ['swagger://*.yaml'],
    },
  ]
});
```

## Development

* `git clone https://github.com/leoiii12/monaco-yaml`
* `cd monaco-yaml`
* `npm install`

## Credits
- https://github.com/redhat-developer/yaml-language-server
- https://github.com/pengx17/monaco-yaml

## License
[MIT](https://github.com/leoiii12/monaco-yaml/blob/master/LICENSE.md)
