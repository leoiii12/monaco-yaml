const fs = require('fs');
const parcelBundler = require('parcel-bundler');

const devDir = 'dist/dev';
const minDir = 'dist/min';

const options = {
  outDir: devDir,
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
  { entry: 'out/monaco.contribution.js', global: 'vs/language/yaml/monaco.contribution', },
  { entry: 'out/yamlWorker.js', global: 'vs/language/yaml/yamlWorker', },
];

const bundle = async () => {
  for (const entry of entries) {
    options.global = entry.global;
    options.minify = false;
    options.scopeHoist = false;
    options.outDir = devDir;

    const bundler = new parcelBundler(entry.entry, options);
    await bundler.bundle()
      .then((bundle) => {
        fs.writeFileSync(`${options.outDir}/${bundle.entryAsset.id}.bundle`, Array.from(bundle.assets).map(a => `${a.name},${a.bundledSize}`).join('\n'));
      });
  }

  for (const entry of entries) {
    options.global = entry.global;
    options.minify = true;
    options.scopeHoist = true;
    options.outDir = minDir;

    const bundler = new parcelBundler(entry.entry, options);
    await bundler.bundle();
  }
};

bundle().then(() => {
});





