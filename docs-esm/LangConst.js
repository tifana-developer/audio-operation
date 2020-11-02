var LangConst = (function () {
    function LangConst() {
    }
    Object.defineProperty(LangConst.prototype, "LANGUAGE", {
        get: function () {
            return {
                ja: '日本語',
                en: '英語',
                zh: '中国語',
                ko: '韓国語',
                th: 'タイ語',
                vi: 'ベトナム語',
                id: 'インドネシア語',
                my: 'ミャンマー語、ビルマ語',
                fr: 'フランス語',
                es: 'スペイン語',
                pt: 'ポルトガル語',
                tl: 'タガログ語'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LangConst.prototype, "REGION", {
        get: function () {
            return {
                JP: '日本',
                US: 'アメリカ',
                CN: '簡体字、中国本土',
                TW: '繁体字、台湾',
                KR: '韓国',
                TH: 'タイ',
                VN: 'ベトナム',
                ID: 'インドネシア',
                MM: 'ミャンマー',
                FR: 'フランス',
                ES: 'スペイン',
                BR: 'ブラジル',
                PH: 'フィリピン'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LangConst.prototype, "FULL_LIST", {
        get: function () {
            return [
                this._langObj('ja', 'JP'),
                this._langObj('en', 'US'),
                this._langObj('zh', 'CN'),
                this._langObj('zh', 'TW'),
                this._langObj('ko', 'KR'),
                this._langObj('th', 'TH'),
                this._langObj('vi', 'VN'),
                this._langObj('id', 'ID'),
                this._langObj('my', 'MM'),
                this._langObj('fr', 'FR'),
                this._langObj('es', 'ES'),
                this._langObj('pt', 'BR'),
                this._langObj('tl', 'PH')
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LangConst.prototype, "GCP_LIST", {
        get: function () {
            return [
                this._langObj('ja', 'JP'),
                this._langObj('en', 'US'),
                this._langObj('zh', 'CN'),
                this._langObj('zh', 'TW'),
                this._langObj('ko', 'KR'),
                this._langObj('th', 'TH'),
                this._langObj('vi', 'VN'),
                this._langObj('id', 'ID'),
                this._langObj('my'),
                this._langObj('fr', 'FR'),
                this._langObj('es', 'ES'),
                this._langObj('pt', 'BR'),
                this._langObj('tl')
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LangConst.prototype, "MIRAI_LIST", {
        get: function () {
            return [
                this._langObj('ja'),
                this._langObj('en', 'US'),
                this._langObj('zh', 'CN'),
                this._langObj('zh', 'TW'),
                this._langObj('ko'),
                this._langObj('th'),
                this._langObj('vi'),
                this._langObj('id'),
                this._langObj('my'),
                this._langObj('fr'),
                this._langObj('es'),
                this._langObj('pt', 'BR'),
                this._langObj('tl')
            ];
        },
        enumerable: true,
        configurable: true
    });
    LangConst.prototype.gcp = function (arg, region) {
        var _a = arg.indexOf('-') != -1 && region === undefined
            ? arg.split('-')
            : [arg, region], lang = _a[0], regi = _a[1];
        return this._find(this.GCP_LIST, lang, regi);
    };
    LangConst.prototype.mirai = function (arg, region) {
        var _a = arg.indexOf('-') != -1 && region === undefined
            ? arg.split('-')
            : [arg, region], lang = _a[0], regi = _a[1];
        return this._find(this.MIRAI_LIST, lang, regi);
    };
    LangConst.prototype._find = function (langList, language, region) {
        var index = langList.findIndex(function (item) {
            return item.language === language &&
                (!region
                    ? true
                    : item.region.toLowerCase() === region.toLowerCase() ||
                        (!item.region.toLowerCase() && region.toLowerCase()));
        });
        return index === -1 ? this._langObj() : langList[index];
    };
    LangConst.prototype._langObj = function (language, region) {
        if (!language && !region) {
            return {
                language: '',
                region: '',
                code: '',
                label: ''
            };
        }
        return region
            ? {
                language: language ? language : '',
                region: region,
                code: language + "-" + region,
                label: (language ? this.LANGUAGE[language] : '') + "\uFF08" + this.REGION[region] + "\uFF09"
            }
            : {
                language: language ? language : '',
                region: '',
                code: "" + language,
                label: "" + (language ? this.LANGUAGE[language] : '')
            };
    };
    return LangConst;
}());
export { LangConst };
export var langConst = new LangConst();
export default langConst;
//# sourceMappingURL=LangConst.js.map