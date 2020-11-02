export declare class RecognitionNormalize {
    get DICT(): {
        [s: string]: {
            [s: string]: Array<string>;
        };
    };
    execute(dict: {
        [s: string]: {
            [s: string]: Array<string>;
        };
    }, recognitionResult: Array<{
        candidate: Array<{
            confidence: number;
            transcript: string;
        }>;
        lang: string;
    }>, langCode: string): string;
}
export declare const recognitionNormalize: RecognitionNormalize;
export default recognitionNormalize;
//# sourceMappingURL=RecognitionNormalize.d.ts.map