/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class AudioPlayer extends EventEmitter {
    private _sound;
    private _intervalId;
    private _processingFlg;
    private _volume;
    private _mute;
    constructor();
    get EVENT_START(): string;
    get EVENT_STOP(): string;
    get EVENT_DATAAVAILABLE(): string;
    get EVENT_MUTE(): string;
    get EVENT_PAUSE(): string;
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
    pause(): void;
    pauseToggle(): void;
    volume(volume: number): void;
    mute(muted: boolean): void;
    muteToggle(): void;
    sysAudio(src: string): void;
    audioSpeech(src: string): void;
    private _lipSync;
    private _close;
}
export declare const audioPlayer: AudioPlayer;
export default audioPlayer;
//# sourceMappingURL=AudioPlayer.d.ts.map