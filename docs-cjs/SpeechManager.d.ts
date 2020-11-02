/// <reference types="node" />
import { EventEmitter } from 'events';
import window from './window';
export declare class SpeechManager extends EventEmitter {
    constructor();
    private _recognition;
    private _previousText;
    private _resultText;
    private _processingFlg;
    private _overlapLangCodeReg;
    get EVENT_START(): string;
    get EVENT_STOP(): string;
    get EVENT_DATAAVAILABLE(): string;
    get EVENT_RESULT(): string;
    get EVENT_CANCEL(): string;
    on(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
    eventResponse(result: {
        [s: string]: any;
    } | string): {
        result: {
            [s: string]: any;
        } | string;
        flg: boolean;
    };
    start(lang: string): void;
    stop(): void;
    isSpeechRecognition(): boolean;
    speechRecognition(): ReturnType<typeof window['speechRecognition']>;
    speechRecording(lang: string): void;
}
export declare const speechManager: SpeechManager;
export default speechManager;
//# sourceMappingURL=SpeechManager.d.ts.map