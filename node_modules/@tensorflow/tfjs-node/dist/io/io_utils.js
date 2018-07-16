"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    view.forEach(function (value, i) {
        buf[i] = value;
    });
    return buf;
}
exports.toBuffer = toBuffer;
function toArrayBuffer(buf) {
    if (Array.isArray(buf)) {
        var totalLength_1 = 0;
        buf.forEach(function (buffer) {
            totalLength_1 += buffer.length;
        });
        var ab = new ArrayBuffer(totalLength_1);
        var view_1 = new Uint8Array(ab);
        var pos_1 = 0;
        buf.forEach(function (buffer) {
            for (var i = 0; i < buffer.length; ++i) {
                view_1[pos_1++] = buffer[i];
            }
        });
        return ab;
    }
    else {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }
}
exports.toArrayBuffer = toArrayBuffer;
function getModelArtifactsInfoForJSON(modelArtifacts) {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
        throw new Error('Expected JSON model topology, received ArrayBuffer.');
    }
    return {
        dateSaved: new Date(),
        modelTopologyType: 'JSON',
        modelTopologyBytes: modelArtifacts.modelTopology == null ?
            0 :
            Buffer.byteLength(JSON.stringify(modelArtifacts.modelTopology), 'utf8'),
        weightSpecsBytes: modelArtifacts.weightSpecs == null ?
            0 :
            Buffer.byteLength(JSON.stringify(modelArtifacts.weightSpecs), 'utf8'),
        weightDataBytes: modelArtifacts.weightData == null ?
            0 :
            modelArtifacts.weightData.byteLength,
    };
}
exports.getModelArtifactsInfoForJSON = getModelArtifactsInfoForJSON;
