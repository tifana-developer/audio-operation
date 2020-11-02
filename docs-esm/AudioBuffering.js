var AudioBuffering = (function () {
    function AudioBuffering() {
        this._chunks = {};
    }
    AudioBuffering.prototype.push = function (chunkName, data) {
        if (!(chunkName in this._chunks)) {
            this._chunks[chunkName] = [];
        }
        this._chunks[chunkName].push(data);
    };
    AudioBuffering.prototype.clear = function () {
        delete this._chunks;
        this._chunks = {};
    };
    AudioBuffering.prototype.get = function (chunkName) {
        if (!(chunkName in this._chunks)) {
            return new Float32Array(0);
        }
        return this._mergeBuffers(this._chunks[chunkName]);
    };
    AudioBuffering.prototype._mergeBuffers = function (data) {
        var sampleLength = 0;
        for (var i = 0, l = data.length; i < l; i++) {
            sampleLength += this._objLen(data[i]);
        }
        var samples = new Float32Array(sampleLength);
        var sampleIndex = 0;
        for (var i = 0, l = data.length; i < l; i++) {
            for (var j = 0, m = this._objLen(data[i]); j < m; j++) {
                samples[sampleIndex] = data[i][j];
                sampleIndex += 1;
            }
        }
        return samples;
    };
    AudioBuffering.prototype._objLen = function (obj) {
        return Object.keys(obj).length;
    };
    return AudioBuffering;
}());
export { AudioBuffering };
export var audioBuffering = new AudioBuffering();
export default audioBuffering;
//# sourceMappingURL=AudioBuffering.js.map