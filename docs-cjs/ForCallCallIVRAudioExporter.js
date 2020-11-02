"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wav_encoder_1 = __importDefault(require("wav-encoder"));
var ForCallCallIVRAudioExporter = (function () {
    function ForCallCallIVRAudioExporter() {
        this._whiteNoise1sec = {
            sampleRate: 8000,
            channelData: []
        };
        this._opts = {
            bitDepth: 16,
            float: false,
            symmetric: false
        };
    }
    ForCallCallIVRAudioExporter.prototype.exportWAV = function (audioData) {
        var data = audioData.slice();
        this._whiteNoise1sec.channelData[0] = data;
        var ArrayBuffer = wav_encoder_1.default.encode.sync(this._whiteNoise1sec, this._opts);
        return new Blob([ArrayBuffer], { type: 'audio/wav' });
    };
    return ForCallCallIVRAudioExporter;
}());
exports.ForCallCallIVRAudioExporter = ForCallCallIVRAudioExporter;
exports.forCallCallIVRAudioExporter = new ForCallCallIVRAudioExporter();
exports.default = exports.forCallCallIVRAudioExporter;
//# sourceMappingURL=ForCallCallIVRAudioExporter.js.map