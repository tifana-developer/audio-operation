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
var window_1 = __importDefault(require("./window"));
var AudioBuffering_1 = __importDefault(require("./AudioBuffering"));
var SamplingRateConverter_1 = __importDefault(require("./SamplingRateConverter"));
var ForMIRAIAudioExporter_1 = __importDefault(require("./ForMIRAIAudioExporter"));
var ForCallCallIVRAudioExporter_1 = __importDefault(require("./ForCallCallIVRAudioExporter"));
var ForGoogleSTTAudioExporter_1 = __importDefault(require("./ForGoogleSTTAudioExporter"));
var UserMediaStream_1 = __importDefault(require("./UserMediaStream"));
var AudioManager = (function (_super) {
    __extends(AudioManager, _super);
    function AudioManager() {
        var _this = _super.call(this) || this;
        _this._audioContext = null;
        _this._processor = null;
        _this._input = null;
        _this._globalStream = null;
        _this._processingFlg = false;
        _this._gainNode = null;
        _this.GAIN_VALUE = 1000;
        return _this;
    }
    Object.defineProperty(AudioManager.prototype, "EVENT_START", {
        get: function () {
            return 'audioManager.start';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "EVENT_STOP", {
        get: function () {
            return 'audioManager.stop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "EVENT_DATAAVAILABLE", {
        get: function () {
            return 'audioManager.dataavailable';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "EVENT_RESULT", {
        get: function () {
            return 'audioManager.result';
        },
        enumerable: true,
        configurable: true
    });
    AudioManager.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    AudioManager.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArrays([event], args));
    };
    AudioManager.prototype.eventResponse = function (result) {
        return {
            result: result,
            flg: this._processingFlg
        };
    };
    AudioManager.prototype.start = function () {
        var _this = this;
        this.stop();
        if (!this._processingFlg) {
            this._audioContext = this.AudioContext();
            UserMediaStream_1.default.get().then(function (mediaStream) {
                _this.AudioRecording(mediaStream);
                _this._processingFlg = true;
                _super.prototype.emit.call(_this, _this.EVENT_START, _this.eventResponse(''));
            });
        }
    };
    AudioManager.prototype.stop = function () {
        if (this._processingFlg) {
            this._close();
            this._processingFlg = false;
            _super.prototype.emit.call(this, this.EVENT_STOP, this.eventResponse(''));
        }
    };
    AudioManager.prototype.AudioContext = function () {
        var AudioContext = window_1.default.AudioContext ||
            window_1.default.webkitAudioContext ||
            window_1.default.mozAudioContext ||
            window_1.default.oAudioContext;
        if (AudioContext === undefined) {
            return;
        }
        return new AudioContext();
    };
    AudioManager.prototype.AudioRecording = function (mediaStream) {
        var _this = this;
        this._processor = this._audioContext.createScriptProcessor(0, 1, 1);
        this._processor.connect(this._audioContext.destination);
        this._audioContext.resume();
        var oldSampleRate = this._audioContext.sampleRate;
        this._globalStream = mediaStream;
        this._input = this._audioContext.createMediaStreamSource(mediaStream);
        this._gainNode = this._audioContext.createGain();
        this._gainNode.gain.value = this.GAIN_VALUE / 100;
        this._gainNode.connect(this._processor);
        this._input.connect(this._gainNode);
        this._processor.addEventListener('audioprocess', function (audio) {
            var inputChannelData = audio.inputBuffer.getChannelData(0);
            var audio16khz = SamplingRateConverter_1.default.exec(inputChannelData, oldSampleRate, 16000);
            var audio8khz = SamplingRateConverter_1.default.exec(inputChannelData, oldSampleRate, 8000);
            AudioBuffering_1.default.push('originalAudio', inputChannelData);
            AudioBuffering_1.default.push('audio16khz', audio16khz);
            AudioBuffering_1.default.push('audio8khz', audio8khz);
            var data = {
                chunkData: inputChannelData,
                audio16khz: audio16khz,
                audio8khz: audio8khz
            };
            _super.prototype.emit.call(_this, _this.EVENT_DATAAVAILABLE, _this.eventResponse(data));
        });
    };
    AudioManager.prototype._close = function () {
        var _this = this;
        this._result();
        var track = this._globalStream.getTracks()[0];
        track.stop();
        AudioBuffering_1.default.clear();
        this._input.disconnect(this._gainNode);
        this._processor.disconnect(this._audioContext.destination);
        this._audioContext.close().then(function () {
            _this._input = null;
            _this._processor = null;
            _this._audioContext = null;
            _this._gainNode = null;
        });
    };
    AudioManager.prototype._result = function () {
        console.time('time: Audio Convert');
        var originalAudio = AudioBuffering_1.default.get('originalAudio');
        var pcmOriginal = ForMIRAIAudioExporter_1.default.exportPCM(originalAudio);
        var wavOriginal = ForCallCallIVRAudioExporter_1.default.exportWAV(originalAudio);
        var audio16khz = AudioBuffering_1.default.get('audio16khz');
        var pcm16khz = ForMIRAIAudioExporter_1.default.exportPCM(audio16khz);
        var wav16khz = ForGoogleSTTAudioExporter_1.default.exportWAV(audio16khz);
        var audio8khz = AudioBuffering_1.default.get('audio8khz');
        var wav8khz = ForCallCallIVRAudioExporter_1.default.exportWAV(audio8khz);
        console.timeEnd('time: Audio Convert');
        var data = {
            pcmOriginal: pcmOriginal,
            wavOriginal: wavOriginal,
            forMIRAIAudio: pcm16khz,
            forCallCallIVRAudio: wav8khz,
            forGoogleSTTAudio: wav16khz
        };
        _super.prototype.emit.call(this, this.EVENT_RESULT, this.eventResponse(data));
    };
    return AudioManager;
}(events_1.EventEmitter));
exports.AudioManager = AudioManager;
exports.audioManager = new AudioManager();
exports.default = exports.audioManager;
//# sourceMappingURL=AudioManager.js.map