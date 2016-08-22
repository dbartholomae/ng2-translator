Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('reflect-metadata');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

var browser = require('@angular/platform-browser/testing');
var TestBed = require('@angular/core/testing').TestBed;

TestBed.initTestEnvironment(
  browser.BrowserTestingModule,
  browser.platformBrowserTesting()
);
