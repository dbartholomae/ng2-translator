module.exports = function(type) {
  return(function(config) {
    return config.set({
      files: [
        {pattern: '../karma-test-shim.js', watched: false},
        '**/*.' + type + '.ts'
      ],
      basePath: 'src',
        preprocessors: {
        "**/*.ts": ['webpack'],
          "../karma-test-shim.js": ['webpack']
      },
      coverageReporter: {
        dir: '../coverage'
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
      reporters: ['progress', 'coverage'],
      client: {
        mocha: {
          reporter: 'html'
        }
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['PhantomJS'],
      captureTimeout: 60000,
      singleRun: true
    });
  });
};
