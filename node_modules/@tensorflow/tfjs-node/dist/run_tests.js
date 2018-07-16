"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index");
var jasmine_util = require("@tensorflow/tfjs-core/dist/jasmine_util");
var jasmineCtor = require('jasmine');
jasmine_util.setBeforeAll(function () { });
jasmine_util.setAfterAll(function () { });
jasmine_util.setBeforeEach(function () { });
jasmine_util.setAfterEach(function () { });
jasmine_util.setTestEnvFeatures([{ BACKEND: 'tensorflow' }]);
var IGNORE_LIST = [
    'depthwiseConv2D',
    'separableConv2d',
    'IORouterRegistry',
    'arrayBufferToBase64String', 'stringByteLength'
];
var runner = new jasmineCtor();
runner.loadConfig({
    spec_files: [
        'src/**/*_test.ts', 'node_modules/@tensorflow/tfjs-core/dist/**/*_test.js'
    ]
});
var env = jasmine.getEnv();
env.specFilter = function (spec) {
    for (var i = 0; i < IGNORE_LIST.length; ++i) {
        if (spec.getFullName().startsWith(IGNORE_LIST[i])) {
            return false;
        }
    }
    return true;
};
runner.execute();
