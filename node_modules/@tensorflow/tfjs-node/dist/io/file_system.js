"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var util_1 = require("util");
var io_utils_1 = require("./io_utils");
var NodeFileSystem = (function () {
    function NodeFileSystem(path) {
        this.MODEL_JSON_FILENAME = 'model.json';
        this.WEIGHTS_BINARY_FILENAME = 'weights.bin';
        if (Array.isArray(path)) {
            this.path = path.map(function (p) { return path_1.resolve(p); });
        }
        else {
            this.path = path_1.resolve(path);
        }
    }
    NodeFileSystem.prototype.save = function (modelArtifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var weightsBinPath, weightsManifest, modelJSON, modelJSONPath, writeFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Array.isArray(this.path)) {
                            throw new Error('Cannot perform saving to multiple paths.');
                        }
                        return [4, this.createOrVerifyDirectory()];
                    case 1:
                        _a.sent();
                        if (!(modelArtifacts.modelTopology instanceof ArrayBuffer)) return [3, 2];
                        throw new Error('NodeFileSystem.save() does not support saving model topology ' +
                            'in binary format yet.');
                    case 2:
                        weightsBinPath = path_1.join(this.path, this.WEIGHTS_BINARY_FILENAME);
                        weightsManifest = [{
                                paths: [this.WEIGHTS_BINARY_FILENAME],
                                weights: modelArtifacts.weightSpecs
                            }];
                        modelJSON = {
                            modelTopology: modelArtifacts.modelTopology,
                            weightsManifest: weightsManifest,
                        };
                        modelJSONPath = path_1.join(this.path, this.MODEL_JSON_FILENAME);
                        writeFile = util_1.promisify(fs.writeFile);
                        return [4, writeFile(modelJSONPath, JSON.stringify(modelJSON), 'utf8')];
                    case 3:
                        _a.sent();
                        return [4, writeFile(weightsBinPath, io_utils_1.toBuffer(modelArtifacts.weightData), 'binary')];
                    case 4:
                        _a.sent();
                        return [2, {
                                modelArtifactsInfo: io_utils_1.getModelArtifactsInfoForJSON(modelArtifacts)
                            }];
                }
            });
        });
    };
    NodeFileSystem.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exists, stat, readFile, modelJSON, _a, _b, modelArtifacts, dirName, buffers, weightSpecs, _i, _c, group, _d, _e, path, weightFilePath, buffer, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (Array.isArray(this.path)) {
                            throw new Error('Loading from multiple paths is not supported yet.');
                        }
                        exists = util_1.promisify(fs.exists);
                        return [4, exists(this.path)];
                    case 1:
                        if (!(_g.sent())) {
                            throw new Error("Path " + this.path + " does not exist: loading failed.");
                        }
                        stat = util_1.promisify(fs.stat);
                        return [4, stat(this.path)];
                    case 2:
                        if (!(_g.sent()).isFile()) return [3, 13];
                        readFile = util_1.promisify(fs.readFile);
                        _b = (_a = JSON).parse;
                        return [4, readFile(this.path, 'utf8')];
                    case 3:
                        modelJSON = _b.apply(_a, [_g.sent()]);
                        modelArtifacts = {
                            modelTopology: modelJSON.modelTopology,
                        };
                        if (!(modelJSON.weightsManifest != null)) return [3, 12];
                        dirName = path_1.dirname(this.path);
                        buffers = [];
                        weightSpecs = [];
                        _i = 0, _c = modelJSON.weightsManifest;
                        _g.label = 4;
                    case 4:
                        if (!(_i < _c.length)) return [3, 11];
                        group = _c[_i];
                        _d = 0, _e = group.paths;
                        _g.label = 5;
                    case 5:
                        if (!(_d < _e.length)) return [3, 9];
                        path = _e[_d];
                        weightFilePath = path_1.join(dirName, path);
                        return [4, exists(weightFilePath)];
                    case 6:
                        if (!(_g.sent())) {
                            throw new Error("Weight file " + weightFilePath + " does not exist: loading failed");
                        }
                        _f = Buffer.bind;
                        return [4, readFile(weightFilePath)];
                    case 7:
                        buffer = new (_f.apply(Buffer, [void 0, _g.sent()]))();
                        buffers.push(buffer);
                        _g.label = 8;
                    case 8:
                        _d++;
                        return [3, 5];
                    case 9:
                        weightSpecs.push.apply(weightSpecs, group.weights);
                        _g.label = 10;
                    case 10:
                        _i++;
                        return [3, 4];
                    case 11:
                        modelArtifacts.weightSpecs = weightSpecs;
                        modelArtifacts.weightData = io_utils_1.toArrayBuffer(buffers);
                        _g.label = 12;
                    case 12: return [2, modelArtifacts];
                    case 13: throw new Error('The path to load from must be a file. Loading from a directory ' +
                        'is not supported.');
                }
            });
        });
    };
    NodeFileSystem.prototype.createOrVerifyDirectory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, path, exists, stat, mkdir;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = Array.isArray(this.path) ? this.path : [this.path];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 7];
                        path = _a[_i];
                        exists = util_1.promisify(fs.exists);
                        stat = util_1.promisify(fs.stat);
                        return [4, exists(path)];
                    case 2:
                        if (!_b.sent()) return [3, 4];
                        return [4, stat(path)];
                    case 3:
                        if ((_b.sent()).isFile()) {
                            throw new Error("Path " + path + " exists as a file. The path must be " +
                                "nonexistent or point to a directory.");
                        }
                        return [3, 6];
                    case 4:
                        mkdir = util_1.promisify(fs.mkdir);
                        return [4, mkdir(path)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3, 1];
                    case 7: return [2];
                }
            });
        });
    };
    NodeFileSystem.URL_SCHEME = 'file://';
    return NodeFileSystem;
}());
exports.NodeFileSystem = NodeFileSystem;
exports.nodeFileSystemRouter = function (url) {
    if (url.startsWith(NodeFileSystem.URL_SCHEME)) {
        return new NodeFileSystem(url.slice(NodeFileSystem.URL_SCHEME.length));
    }
    else {
        return null;
    }
};
