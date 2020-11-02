/// <reference types="node" />
import { EventEmitter } from 'events';
import window from './window';
export declare class AudioManager extends EventEmitter {
    constructor();
    private _audioContext;
    private _processor;
    private _input;
    private _globalStream;
    private _processingFlg;
    private _gainNode;
    private GAIN_VALUE;
    get EVENT_START(): string;
    get EVENT_STOP(): string;
    get EVENT_DATAAVAILABLE(): string;
    get EVENT_RESULT(): string;
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
    start(): void;
    stop(): void;
    AudioContext(): ReturnType<typeof window['AudioContext']>;
    AudioRecording(mediaStream: MediaStream): void;
    private _close;
    private _result;
}
export declare const audioManager: AudioManager;
export default audioManager;
//# sourceMappingURL=AudioManager.d.ts.map