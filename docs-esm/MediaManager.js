var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { EventEmitter } from 'events';
import window from './window';
import UserMediaStream from './UserMediaStream';
var MediaManager = (function (_super) {
    __extends(MediaManager, _super);
    function MediaManager() {
        var _this = _super.call(this) || this;
        _this._mediaRecorder = null;
        _this._processingFlg = false;
        return _this;
    }
    Object.defineProperty(MediaManager.prototype, "EVENT_START", {
        get: function () {
            return 'mediaManager.start';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaManager.prototype, "EVENT_STOP", {
        get: function () {
            return 'mediaManager.stop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaManager.prototype, "EVENT_DATAAVAILABLE", {
        get: function () {
            return 'mediaManager.dataavailable';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaManager.prototype, "EVENT_RESULT", {
        get: function () {
            return 'mediaManager.result';
        },
        enumerable: true,
        configurable: true
    });
    MediaManager.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    MediaManager.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArrays([event], args));
    };
    MediaManager.prototype.eventResponse = function (result) {
        return {
            result: result,
            flg: this._processingFlg
        };
    };
    MediaManager.prototype.start = function () {
        var _this = this;
        this.stop();
        if (!this._processingFlg) {
            UserMediaStream.get().then(function (mediaStream) {
                _this.MediaRecording(mediaStream);
                _this._processingFlg = true;
                _super.prototype.emit.call(_this, _this.EVENT_START, _this.eventResponse(''));
            });
        }
    };
    MediaManager.prototype.stop = function () {
        if (this._mediaRecorder && this._processingFlg) {
            this._mediaRecorder.stop();
            this._processingFlg = false;
            _super.prototype.emit.call(this, this.EVENT_STOP, this.eventResponse(''));
        }
    };
    MediaManager.prototype.MediaRecorder = function () {
        return window.MediaRecorder || undefined;
    };
    MediaManager.prototype.MediaRecording = function (mediaStream) {
        var _this = this;
        var MediaRecorder = this.MediaRecorder();
        if (MediaRecorder === undefined) {
            return;
        }
        this._mediaRecorder = new MediaRecorder(mediaStream);
        try {
            var _chunks_1 = [];
            this._mediaRecorder.addEventListener('start', function () {
            });
            this._mediaRecorder.addEventListener('stop', function () {
                var mimeType = _chunks_1.length && _chunks_1[0].type !== undefined
                    ? _chunks_1[0].type
                    : '';
                var webm = new Blob(_chunks_1, { type: mimeType });
                _chunks_1 = [];
                var data = {
                    originalAudio: webm
                };
                _super.prototype.emit.call(_this, _this.EVENT_RESULT, _this.eventResponse(data));
            });
            this._mediaRecorder.addEventListener('dataavailable', function (event) {
                if (event.data.size > 0) {
                    _chunks_1.push(event.data);
                    var data = {
                        chunkData: event.data
                    };
                    _super.prototype.emit.call(_this, _this.EVENT_DATAAVAILABLE, _this.eventResponse(data));
                }
            });
            this._mediaRecorder.addEventListener('error', function () {
            });
            this._mediaRecorder.addEventListener('pause', function () {
            });
            this._mediaRecorder.addEventListener('resume', function () {
            });
        }
        catch (err) {
            throw new Error(err);
        }
        this._mediaRecorder.start(20);
    };
    return MediaManager;
}(EventEmitter));
export { MediaManager };
export var mediaManager = new MediaManager();
export default mediaManager;
//# sourceMappingURL=MediaManager.js.map