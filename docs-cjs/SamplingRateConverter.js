"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SamplingRateConverter = (function () {
    function SamplingRateConverter() {
    }
    SamplingRateConverter.prototype.exec = function (inputChannelData, fromSampleRate, toSampleRate) {
        var data = inputChannelData.slice();
        var bufferSize = data.length * (toSampleRate / fromSampleRate);
        var resampleData = this.interpolateArray(data, bufferSize);
        var outputChannelData = this.buffering(resampleData, bufferSize);
        return outputChannelData;
    };
    SamplingRateConverter.prototype.interpolateArray = function (data, fitCount) {
        var linearInterpolate = function (before, after, atPoint) {
            return before + (after - before) * atPoint;
        };
        var newData = [];
        var springFactor = Number((data.length - 1) / (fitCount - 1));
        newData[0] = data[0];
        for (var i = 1; i < fitCount - 1; i++) {
            var tmp = i * springFactor;
            var before = Number(Math.floor(tmp).toFixed());
            var after = Number(Math.ceil(tmp).toFixed());
            var atPoint = tmp - before;
            newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1];
        return newData;
    };
    SamplingRateConverter.prototype.buffering = function (input, fitCount) {
        var output = new Float32Array(fitCount);
        for (var i = 0; i < fitCount; i++) {
            output[i] = input[i];
        }
        return output;
    };
    return SamplingRateConverter;
}());
exports.SamplingRateConverter = SamplingRateConverter;
exports.samplingRateConverter = new SamplingRateConverter();
exports.default = exports.samplingRateConverter;
//# sourceMappingURL=SamplingRateConverter.js.map