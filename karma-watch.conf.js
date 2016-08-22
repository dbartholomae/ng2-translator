module.exports = function(config) {
  return config.set({
    files: [
      {pattern: '../karma-test-shim.js', watched: false},
      '**/*.spec.ts',
      '**/*.int.ts'
    ],
    basePath: 'src',
    preprocessors: {
      "**/*.ts": ['webpack'],
      "../karma-test-shim.js": ['webpack']
    },
    frameworks: ['mocha', 'chai-as-promised', 'chai-things', 'chai-sinon'],
    webpack: {
      resolve: {
        extensions: ['', '.js', '.ts']
      },
      module: {
        loaders: [{
          test: /\.ts$/,
          loader: "ts"
        }]
      }
    },
    reporters: ['progress'],
    client: {
      mocha: {
        reporter: 'html'
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    captureTimeout: 60000,
    singleRun: false
  });
};
