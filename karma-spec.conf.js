module.exports = function(config) {
  return config.set({
    files: [
      {pattern: '../karma-test-shim.js', watched: false},
      '**/*.spec.ts'
    ],
    basePath: 'src',
    preprocessors: {
      "**/*.ts": ['webpack'],
      "../karma-test-shim.js": ['webpack']
    },
    coverageReporter: {
      dir: '../coverage',
      reporters: [{ type: 'lcov', subdir: 'report-lcov' }]
    },
    frameworks: ['mocha', 'chai-as-promised', 'chai-things', 'chai-sinon'],
    webpack: {
      resolve: {
        extensions: ['', '.js', '.ts']
      },
      module: {
        loaders: [{
          test: /\.ts$/,
          exclude: /\.(e2e|int|spec)\.ts/,
          loader: "istanbul-instrumenter"
        }, {
          test: /\.ts$/,
          loader: "ts"
        }]
      }
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: true
  });
};
