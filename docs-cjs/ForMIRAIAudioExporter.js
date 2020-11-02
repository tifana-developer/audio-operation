"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ForMIRAIAudioExporter = (function () {
    function ForMIRAIAudioExporter() {
    }
    ForMIRAIAudioExporter.prototype.exportPCM = function (audioData) {
        var data = audioData.slice();
        var dataview = this._encodePCM(data);
        return new Blob([dataview], { type: 'application/octet-stream' });
    };
    ForMIRAIAudioExporter.prototype._encodePCM = function (samples) {
        var offset = 0;
        var buffer = new ArrayBuffer(offset + samples.length * 2);
        var output = new DataView(buffer);
        return this._floatTo16BitPCM(offset, output, samples, false);
    };
    ForMIRAIAudioExporter.prototype._floatTo16BitPCM = function (offset, output, input, littleEndian) {
        if (littleEndian === void 0) { littleEndian = true; }
        for (var i = 0, l = input.length; i < l; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, littleEndian);
        }
        return output;
    };
    return ForMIRAIAudioExporter;
}());
exports.ForMIRAIAudioExporter = ForMIRAIAudioExporter;
exports.forMIRAIAudioExporter = new ForMIRAIAudioExporter();
exports.default = exports.forMIRAIAudioExporter;
//# sourceMappingURL=ForMIRAIAudioExporter.js.map