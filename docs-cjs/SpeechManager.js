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
var LangConst_1 = __importDefault(require("./LangConst"));
var SpeechManager = (function (_super) {
    __extends(SpeechManager, _super);
    function SpeechManager() {
        var _this = _super.call(this) || this;
        _this._recognition = null;
        _this._previousText = '';
        _this._resultText = [];
        _this._processingFlg = false;
        var overlapLangCode = [
            LangConst_1.default.gcp('ja', 'JP').code,
            LangConst_1.default.gcp('zh', 'CN').code,
            LangConst_1.default.gcp('zh', 'TW').code,
            LangConst_1.default.gcp('th', 'TH').code
        ];
        _this._overlapLangCodeReg = new RegExp('(' + overlapLangCode.filter(Boolean).join('|') + ')', 'gi');
        return _this;
    }
    Object.defineProperty(SpeechManager.prototype, "EVENT_START", {
        get: function () {
            return 'speechManager.start';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechManager.prototype, "EVENT_STOP", {
        get: function () {
            return 'speechManager.stop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechManager.prototype, "EVENT_DATAAVAILABLE", {
        get: function () {
            return 'speechManager.dataavailable';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechManager.prototype, "EVENT_RESULT", {
        get: function () {
            return 'speechManager.result';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpeechManager.prototype, "EVENT_CANCEL", {
        get: function () {
            return 'speechManager.cancel';
        },
        enumerable: true,
        configurable: true
    });
    SpeechManager.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    SpeechManager.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArrays([event], args));
    };
    SpeechManager.prototype.eventResponse = function (result) {
        return {
            result: result,
            flg: this._processingFlg
        };
    };
    SpeechManager.prototype.start = function (lang) {
        this.stop();
        if (!this._processingFlg) {
            this._recognition = null;
            this.speechRecording(lang);
            _super.prototype.emit.call(this, this.EVENT_START, this.eventResponse(''));
            this._processingFlg = true;
        }
    };
    SpeechManager.prototype.stop = function () {
        if (this._recognition && this._processingFlg) {
            this._recognition.stop();
            if (this._previousText === '') {
                _super.prototype.emit.call(this, this.EVENT_CANCEL, this.eventResponse(''));
            }
            else {
                _super.prototype.emit.call(this, this.EVENT_STOP, this.eventResponse(''));
            }
            this._previousText = '';
            this._resultText = [];
            this._processingFlg = false;
        }
    };
    SpeechManager.prototype.isSpeechRecognition = function () {
        return this.speechRecognition() !== undefined;
    };
    SpeechManager.prototype.speechRecognition = function () {
        return (window_1.default.speechRecognition ||
            window_1.default.webkitSpeechRecognition ||
            window_1.default.mozSpeechRecognition ||
            window_1.default.oSpeechRecognition ||
            undefined);
    };
    SpeechManager.prototype.speechRecording = function (lang) {
        var _this = this;
        var speechRecognition = this.speechRecognition();
        if (speechRecognition === undefined) {
            return;
        }
        this._recognition = new speechRecognition();
        try {
            this._recognition.lang = lang;
            this._recognition.continuous = true;
            this._recognition.interimResults = true;
            this._recognition.maxAlternatives = 10;
            this._recognition.addEventListener('error', function () {
                _this._recognition.abort();
                _this._recognition.stop();
            });
            this._recognition.addEventListener('nomatch', function () {
            });
            this._recognition.addEventListener('result', function (event) {
                var textArr = [];
                for (var i = 0, il = event.results.length; i < il; i++) {
                    try {
                        for (var j = 0, jl = event.results[i].length; j < jl; j++) {
                            textArr.push({
                                confidence: event.results[i][j].confidence,
                                transcript: event.results[i][j].transcript
                            });
                        }
                    }
                    catch (err) {
                        throw new Error(err);
                    }
                }
                var isFinal = event.results[event.results.length - 1].isFinal;
                if (isFinal) {
                    _this._resultText = Array.from(textArr);
                    _this._recognition.stop();
                }
                else {
                    var data = [
                        {
                            candidate: textArr,
                            lang: _this._recognition.lang
                        }
                    ];
                    _super.prototype.emit.call(_this, _this.EVENT_DATAAVAILABLE, _this.eventResponse(data));
                    if (_this._previousText === textArr[0].transcript &&
                        _this._overlapLangCodeReg.test(_this._recognition.lang)) {
                        _this._recognition.stop();
                    }
                    _this._previousText = textArr[0].transcript;
                }
            });
            this._recognition.addEventListener('start', function () {
            });
            this._recognition.addEventListener('end', function () {
                var data = [
                    {
                        candidate: _this._resultText,
                        lang: _this._recognition.lang
                    }
                ];
                _super.prototype.emit.call(_this, _this.EVENT_RESULT, _this.eventResponse(data));
                _this.stop();
            });
            this._recognition.addEventListener('speechstart', function () {
            });
            this._recognition.addEventListener('speechend', function () {
            });
            this._recognition.addEventListener('soundstart', function () {
            });
            this._recognition.addEventListener('soundend', function () {
            });
            this._recognition.addEventListener('audiostart', function () {
            });
            this._recognition.addEventListener('audioend', function () {
            });
        }
        catch (err) {
            throw new Error(err);
        }
        this._recognition.start();
    };
    return SpeechManager;
}(events_1.EventEmitter));
exports.SpeechManager = SpeechManager;
exports.speechManager = new SpeechManager();
exports.default = exports.speechManager;
//# sourceMappingURL=SpeechManager.js.map