"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var navigator_1 = __importDefault(require("./navigator"));
var UserMediaStream = (function () {
    function UserMediaStream() {
    }
    UserMediaStream.prototype.mediaDevices = function () {
        return (navigator_1.default.mediaDevices ||
            (navigator_1.default.mozGetUserMedia ||
                navigator_1.default.webkitGetUserMedia ||
                navigator_1.default.msGetUserMedia
                ? {
                    getUserMedia: function (c) {
                        return new Promise(function (y, n) {
                            (navigator_1.default.mozGetUserMedia || navigator_1.default.webkitGetUserMedia).call(navigator_1.default, c, y, n);
                        });
                    }
                }
                : null));
    };
    UserMediaStream.prototype.get = function () {
        var mediaDevices = this.mediaDevices();
        if (!mediaDevices) {
            throw new Error('[navigator.getUserMedia, navigator.mediaDevices.getUserMedia]: This browser is not supported.');
        }
        var mediaDevicesPromise = Promise.resolve().then(function () { return mediaDevices.enumerateDevices(); });
        var mediaStreamPromise = mediaDevicesPromise.then(function (mediaDeviceInfoList) {
            var audioDevices = mediaDeviceInfoList.filter(function (deviceInfo) { return deviceInfo.kind === 'audioinput'; });
            if (audioDevices.length < 1)
                throw new Error('no audioinput');
            return mediaDevices.getUserMedia({
                audio: true
            });
        });
        return mediaStreamPromise;
    };
    return UserMediaStream;
}());
exports.UserMediaStream = UserMediaStream;
exports.userMediaStream = new UserMediaStream();
exports.default = exports.userMediaStream;
//# sourceMappingURL=UserMediaStream.js.map