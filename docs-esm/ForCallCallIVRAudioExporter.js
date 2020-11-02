import WavEncoder from 'wav-encoder';
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
        var ArrayBuffer = WavEncoder.encode.sync(this._whiteNoise1sec, this._opts);
        return new Blob([ArrayBuffer], { type: 'audio/wav' });
    };
    return ForCallCallIVRAudioExporter;
}());
export { ForCallCallIVRAudioExporter };
export var forCallCallIVRAudioExporter = new ForCallCallIVRAudioExporter();
export default forCallCallIVRAudioExporter;
//# sourceMappingURL=ForCallCallIVRAudioExporter.js.map