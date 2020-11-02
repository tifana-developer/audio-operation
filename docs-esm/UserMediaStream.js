import navigator from './navigator';
var UserMediaStream = (function () {
    function UserMediaStream() {
    }
    UserMediaStream.prototype.mediaDevices = function () {
        return (navigator.mediaDevices ||
            (navigator.mozGetUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.msGetUserMedia
                ? {
                    getUserMedia: function (c) {
                        return new Promise(function (y, n) {
                            (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, c, y, n);
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
export { UserMediaStream };
export var userMediaStream = new UserMediaStream();
export default userMediaStream;
//# sourceMappingURL=UserMediaStream.js.map