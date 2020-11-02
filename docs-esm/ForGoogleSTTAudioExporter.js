import WavEncoder from 'wav-encoder';
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
        var ArrayBuffer = WavEncoder.encode.sync(this._whiteNoise1sec, this._opts);
        return new Blob([ArrayBuffer], { type: 'audio/wav' });
    };
    return ForGoogleSTTAudioExporter;
}());
export { ForGoogleSTTAudioExporter };
export var forGoogleSTTAudioExporter = new ForGoogleSTTAudioExporter();
export default forGoogleSTTAudioExporter;
//# sourceMappingURL=ForGoogleSTTAudioExporter.js.map