"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var howler_1 = require("howler");
var window_1 = __importDefault(require("./window"));
var AudioPlayer = (function (_super) {
    __extends(AudioPlayer, _super);
    function AudioPlayer() {
        var _this = _super.call(this) || this;
        _this._sound = null;
        _this._intervalId = null;
        _this._processingFlg = false;
        _this._volume = 1;
        _this._mute = false;
        window_1.default.executeAudioSpeech = function (audioFile) {
            return _this.audioSpeech(audioFile);
        };
        window_1.default.executeSysAudio = function (audioFile) {
            return _this.sysAudio(audioFile);
        };
        var sound = new howler_1.Howl({
            src: [
                'data:audio/mpeg;base64,UklGRnwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVgAAAAAAAAA//8CAP3/AwD+/wEA//8BAP7/AwD+/wAAAQD//wEA//8AAAEAAAD//wEA//8BAP//AQD//wEA//8BAP7/AwD9/wIA//8AAAAAAQD+/wIA/v8CAP//'
            ]
        });
        sound.once('load', function () {
            sound.on('playerror', function (playerror) {
                console.log('playerror', playerror);
                sound.once('unlock', function (unlockerror) {
                    console.log('unlock', unlockerror);
                    sound.play();
                });
            });
            sound.play();
        });
        var MOUSEUP_EVENT = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
        var initAudioContext = function () {
            document.removeEventListener(MOUSEUP_EVENT, initAudioContext);
            if (!howler_1.Howler.ctx || !howler_1.Howler.ctx.resume) {
                return;
            }
            howler_1.Howler.ctx.resume();
        };
        document.addEventListener(MOUSEUP_EVENT, initAudioContext);
        return _this;
    }
    Object.defineProperty(AudioPlayer.prototype, "EVENT_START", {
        get: function () {
            return 'audioPlayer.start';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "EVENT_STOP", {
        get: function () {
            return 'audioPlayer.stop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "EVENT_DATAAVAILABLE", {
        get: function () {
            return 'audioPlayer.dataavailable';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "EVENT_MUTE", {
        get: function () {
            return 'audioPlayer.mute';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "EVENT_PAUSE", {
        get: function () {
            return 'audioPlayer.pause';
        },
        enumerable: true,
        configurable: true
    });
    AudioPlayer.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    AudioPlayer.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArrays([event], args));
    };
    AudioPlayer.prototype.eventResponse = function (result) {
        return {
            result: result,
            flg: this._processingFlg
        };
    };
    AudioPlayer.prototype.pause = function () {
        if (this._sound && this._sound.playing()) {
            this._sound.pause();
        }
    };
    AudioPlayer.prototype.pauseToggle = function () {
        if (this._sound && this._sound.playing()) {
            this._sound.pause();
        }
        else if (this._sound && !this._sound.playing()) {
            this._sound.play();
        }
    };
    AudioPlayer.prototype.volume = function (volume) {
        this._volume = volume;
        if (this._sound && this._sound.playing()) {
            this._sound.volume(this._volume);
        }
    };
    AudioPlayer.prototype.mute = function (muted) {
        this._mute = muted;
        if (this._sound && this._sound.playing()) {
            this._sound.mute(this._mute);
        }
    };
    AudioPlayer.prototype.muteToggle = function () {
        this._mute = !this._mute;
        if (this._sound && this._sound.playing()) {
            this._sound.mute(this._mute);
        }
    };
    AudioPlayer.prototype.sysAudio = function (src) {
        var sound = new howler_1.Howl({
            src: [src]
        });
        sound.play();
    };
    AudioPlayer.prototype.audioSpeech = function (src) {
        var _this = this;
        if (this._sound && this._sound.playing()) {
            this._close();
        }
        this._sound = new howler_1.Howl({
            src: [src],
            volume: this._volume,
            mute: this._mute
        });
        this._sound.on('load', function () {
            if (!_this._sound.playing()) {
                _this._sound.play();
            }
            else {
                _this._sound.stop();
                _this._sound.unload();
                _this._sound.play();
            }
        });
        this._sound.on('play', function () {
            _this._lipSync();
            _this._processingFlg = true;
            _super.prototype.emit.call(_this, _this.EVENT_START, _this.eventResponse(''));
        });
        this._sound.on('end', function () {
            _this._close();
            _this._processingFlg = false;
            _super.prototype.emit.call(_this, _this.EVENT_STOP, _this.eventResponse(''));
        });
        this._sound.on('pause', function () {
            _super.prototype.emit.call(_this, _this.EVENT_PAUSE, _this.eventResponse(''));
        });
        this._sound.on('mute', function () {
            _super.prototype.emit.call(_this, _this.EVENT_MUTE, _this.eventResponse(''));
        });
    };
    AudioPlayer.prototype._lipSync = function () {
        var _this = this;
        if (!howler_1.Howler.ctx || !howler_1.Howler.ctx.createAnalyser) {
            return;
        }
        var analyser = howler_1.Howler.ctx.createAnalyser();
        howler_1.Howler.masterGain.connect(analyser);
        var spectrums = new Uint8Array(analyser.frequencyBinCount);
        analyser.fftSize = 128;
        var intervalHandler = function () {
            analyser.getByteFrequencyData(spectrums);
            var sum = 0;
            for (var i = 0, l = spectrums.length; i < l; i++) {
                sum += spectrums[i];
            }
            var av = Math.round((sum / spectrums.length) * 10) / 100;
            var data = {
                lipSyncValue: av
            };
            _super.prototype.emit.call(_this, _this.EVENT_DATAAVAILABLE, _this.eventResponse(data));
        };
        this._intervalId = setInterval(intervalHandler, 20);
    };
    AudioPlayer.prototype._close = function () {
        this._sound.stop();
        this._sound.unload();
        if (this._intervalId)
            clearInterval(this._intervalId);
    };
    return AudioPlayer;
}(events_1.EventEmitter));
exports.AudioPlayer = AudioPlayer;
exports.audioPlayer = new AudioPlayer();
exports.default = exports.audioPlayer;
//# sourceMappingURL=AudioPlayer.js.map