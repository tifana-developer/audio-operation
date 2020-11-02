"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RecognitionNormalize = (function () {
    function RecognitionNormalize() {
    }
    Object.defineProperty(RecognitionNormalize.prototype, "DICT", {
        get: function () {
            return {
                PersonalName: {
                    屋敷: [],
                    梨子田: [],
                    小森: []
                },
                PlaceName: {
                    千駄ヶ谷: [],
                    等々力: [],
                    Maihama: [
                        'my Hummer',
                        'my Hama',
                        'my Ama',
                        'my Amma',
                        'my Humma',
                        'my Houma',
                        'my homma',
                        'my hamu',
                        'my hammer',
                        'my Amah'
                    ]
                },
                Landmark: {
                    'ecute(エキュート)': ['ecute', 'エキュート'],
                    'VIEW ALTTE(ビューアルッテ)': ['VIEW ALTTE', 'ビューアルッテ'],
                    'New Days(ニューデイズ)': ['New Days', 'ニューデイズ']
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    RecognitionNormalize.prototype.execute = function (dict, recognitionResult, langCode) {
        var i = recognitionResult.findIndex(function (item) { return item.lang === langCode; });
        var candidate = recognitionResult[i].candidate || [];
        if (candidate.length < 1) {
            return '';
        }
        var normalize = candidate[0].transcript;
        for (var _i = 0, _a = Object.keys(dict); _i < _a.length; _i++) {
            var k = _a[_i];
            var _loop_1 = function (m) {
                var keyword = dict[k][m];
                if (keyword.length === 0)
                    keyword.push(m);
                var reg = new RegExp('(' + keyword.filter(Boolean).join('|') + ')', 'gi');
                var i_1 = candidate.findIndex(function (item) { return reg.test(item.transcript); });
                if (i_1 !== -1) {
                    normalize = candidate[i_1].transcript.replace(reg, m);
                }
            };
            for (var _b = 0, _c = Object.keys(dict[k]); _b < _c.length; _b++) {
                var m = _c[_b];
                _loop_1(m);
            }
        }
        return normalize;
    };
    return RecognitionNormalize;
}());
exports.RecognitionNormalize = RecognitionNormalize;
exports.recognitionNormalize = new RecognitionNormalize();
exports.default = exports.recognitionNormalize;
//# sourceMappingURL=RecognitionNormalize.js.map