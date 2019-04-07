console.log('Launching the app...');

require('@babel/polyfill');

require('@babel/register')({
  extensions: [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
  ],
  plugins: [
    ['module-resolver', {
      'alias': {
        "@@apis": "./src/apis",
      },
    }],
  ],
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
  ],
});

require('./app');
