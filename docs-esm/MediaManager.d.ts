/// <reference types="node" />
import { EventEmitter } from 'events';
import window from './window';
export declare class MediaManager extends EventEmitter {
    constructor();
    private _mediaRecorder;
    private _processingFlg;
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
    MediaRecorder(): ReturnType<typeof window['MediaRecorder']>;
    MediaRecording(mediaStream: MediaStream): void;
}
export declare const mediaManager: MediaManager;
export default mediaManager;
//# sourceMappingURL=MediaManager.d.ts.map