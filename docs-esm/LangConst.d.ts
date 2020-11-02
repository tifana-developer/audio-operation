declare type LanguageIndex = 'ja' | 'en' | 'zh' | 'ko' | 'th' | 'vi' | 'id' | 'my' | 'fr' | 'es' | 'pt' | 'tl' | '';
export declare type languageIndex = LanguageIndex;
declare type RegionIndex = 'JP' | 'US' | 'CN' | 'TW' | 'KR' | 'TH' | 'VN' | 'ID' | 'MM' | 'FR' | 'ES' | 'BR' | 'PH' | '';
export declare type regionIndex = RegionIndex;
declare type CodeIndex = 'ja-JP' | 'en-US' | 'zh-CN' | 'zh-TW' | 'ko-KR' | 'th-TH' | 'vi-VN' | 'id-ID' | 'my-MM' | 'fr-FR' | 'es-ES' | 'pt-BR' | 'tl-PH' | 'ja' | 'en' | 'zh' | 'zh' | 'ko' | 'th' | 'vi' | 'id' | 'my' | 'fr' | 'es' | 'pt' | 'tl' | '';
export declare type codeIndex = CodeIndex;
export interface LangObjInterface {
    language: LanguageIndex;
    region: RegionIndex;
    code: CodeIndex;
    label: string;
}
export declare class LangConst {
    get LANGUAGE(): {
        [key in LanguageIndex]?: string;
    };
    get REGION(): {
        [key in RegionIndex]?: string;
    };
    get FULL_LIST(): Array<LangObjInterface>;
    get GCP_LIST(): Array<LangObjInterface>;
    get MIRAI_LIST(): Array<LangObjInterface>;
    gcp(code: CodeIndex): LangObjInterface;
    gcp(language: LanguageIndex, region: RegionIndex): LangObjInterface;
    mirai(code: CodeIndex): LangObjInterface;
    mirai(language: LanguageIndex, region: RegionIndex): LangObjInterface;
    private _find;
    private _langObj;
}
export declare const langConst: LangConst;
export default langConst;
//# sourceMappingURL=LangConst.d.ts.map