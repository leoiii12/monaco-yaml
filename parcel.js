const fs = require('fs');
const parcelBundler = require('parcel-bundler');

const outDir = 'dist';
const options = {
  outDir: outDir,
  watch: false,
  cache: true,
  cacheDir: '.cache',
  contentHash: true,
  minify: false,
  scopeHoist: false,
  target: 'browser',
  bundleNodeModules: true,
  sourceMaps: false,
  detailedReport: false,
  logLevel: 3
};

const entries = [
  { entry: 'out/monaco.contribution.js', global: 'vs/language/yaml/monaco.contribution' },
  { entry: 'out/yamlWorker.js', global: 'vs/language/yaml/yamlWorker' },
];

const hi = async () => {
  for (const entry of entries) {
    options.global = entry.global;

    const bundler = new parcelBundler(entry.entry, options);
    await bundler
      .bundle()
      .then((bundle) => {
        fs.writeFileSync(`${outDir}/${bundle.entryAsset.id}.bundle`, Array.from(bundle.assets).map(a => `${a.name},${a.bundledSize}`).join('\n'));
      });
  }
};

hi()
  .then(() => {
  });





