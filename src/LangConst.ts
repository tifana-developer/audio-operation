/**
 * 言語コード関連クラス
 * https://ja.wikipedia.org/wiki/IETF%E8%A8%80%E8%AA%9E%E3%82%BF%E3%82%B0
 * https://ja.wikipedia.org/wiki/ISO_3166-1
 * https://ja.wikipedia.org/wiki/ISO_639-1%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7
 */

type LanguageIndex =
  | 'ja'
  | 'en'
  | 'zh'
  | 'ko'
  | 'th'
  | 'vi'
  | 'id'
  | 'my'
  | 'fr'
  | 'es'
  | 'pt'
  | 'tl'
  | '';
export type languageIndex = LanguageIndex;

type RegionIndex =
  | 'JP'
  | 'US'
  | 'CN'
  | 'TW'
  | 'KR'
  | 'TH'
  | 'VN'
  | 'ID'
  | 'MM'
  | 'FR'
  | 'ES'
  | 'BR'
  | 'PH'
  | '';
export type regionIndex = RegionIndex;

type CodeIndex =
  | 'ja-JP'
  | 'en-US'
  | 'zh-CN'
  | 'zh-TW'
  | 'ko-KR'
  | 'th-TH'
  | 'vi-VN'
  | 'id-ID'
  | 'my-MM'
  | 'fr-FR'
  | 'es-ES'
  | 'pt-BR'
  | 'tl-PH'
  | 'ja'
  | 'en'
  | 'zh'
  | 'zh'
  | 'ko'
  | 'th'
  | 'vi'
  | 'id'
  | 'my'
  | 'fr'
  | 'es'
  | 'pt'
  | 'tl'
  | '';
export type codeIndex = CodeIndex;

export interface LangObjInterface {
  language: LanguageIndex;
  region: RegionIndex;
  code: CodeIndex;
  label: string;
}

export class LangConst {
  get LANGUAGE(): { [key in LanguageIndex]?: string } {
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
  }

  get REGION(): { [key in RegionIndex]?: string } {
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
  }

  get FULL_LIST(): Array<LangObjInterface> {
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
  }

  get GCP_LIST(): Array<LangObjInterface> {
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
  }

  get MIRAI_LIST(): Array<LangObjInterface> {
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
  }

  /**
   * GCP用の言語コードを返す
   * https://cloud.google.com/speech-to-text/docs/languages
   */
  gcp(code: CodeIndex): LangObjInterface;
  gcp(language: LanguageIndex, region: RegionIndex): LangObjInterface;
  gcp(arg: LanguageIndex | CodeIndex, region?: RegionIndex): LangObjInterface {
    const [lang, regi] =
      arg.indexOf('-') != -1 && region === undefined
        ? arg.split('-')
        : [arg, region];
    return this._find(
      this.GCP_LIST,
      lang as LanguageIndex,
      regi as RegionIndex
    );
  }

  /**
   * MIRAI翻訳用の言語コードを返す
   */
  mirai(code: CodeIndex): LangObjInterface;
  mirai(language: LanguageIndex, region: RegionIndex): LangObjInterface;
  mirai(
    arg: LanguageIndex | CodeIndex,
    region?: RegionIndex
  ): LangObjInterface {
    const [lang, regi] =
      arg.indexOf('-') != -1 && region === undefined
        ? arg.split('-')
        : [arg, region];

    return this._find(
      this.MIRAI_LIST,
      lang as LanguageIndex,
      regi as RegionIndex
    );
  }

  private _find(
    langList: Array<LangObjInterface>,
    language: LanguageIndex,
    region: RegionIndex
  ): LangObjInterface {
    const index = langList.findIndex(
      (item) =>
        item.language === language &&
        (!region
          ? true
          : item.region.toLowerCase() === region.toLowerCase() || // regionが合致する時
            (!item.region.toLowerCase() && region.toLowerCase()))
    );
    return index === -1 ? this._langObj() : langList[index];
  }

  private _langObj(
    language?: LanguageIndex,
    region?: RegionIndex
  ): LangObjInterface {
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
          code: `${language}-${region}` as CodeIndex,
          label: `${language ? this.LANGUAGE[language] : ''}（${
            this.REGION[region]
          }）`
        }
      : {
          language: language ? language : '',
          region: '',
          code: `${language}` as CodeIndex,
          label: `${language ? this.LANGUAGE[language] : ''}`
        };
  }
}
export const langConst: LangConst = new LangConst();

export default langConst;
