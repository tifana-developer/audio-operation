"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wav_encoder_1 = __importDefault(require("wav-encoder"));
var ForGoogleSTTAudioExporter = (function () {
    function ForGoogleSTTAudioExporter() {
        this._whiteNoise1sec = {
            sampleRate: 16000,
            channelData: []
        };
        this._opts = {
            bitDepth: 16,
            float: false,
            symmetric: false
        };
    }
    ForGoogleSTTAudioExporter.prototype.exportWAV = function (audioData) {
        var data = audioData.slice();
        this._whiteNoise1sec.channelData[0] = data;
        var ArrayBuffer = wav_encoder_1.default.encode.sync(this._whiteNoise1sec, this._opts);
        return new Blob([ArrayBuffer], { type: 'audio/wav' });
    };
    return ForGoogleSTTAudioExporter;
}());
exports.ForGoogleSTTAudioExporter = ForGoogleSTTAudioExporter;
exports.forGoogleSTTAudioExporter = new ForGoogleSTTAudioExporter();
exports.default = exports.forGoogleSTTAudioExporter;
//# sourceMappingURL=ForGoogleSTTAudioExporter.js.map