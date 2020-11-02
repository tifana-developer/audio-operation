export declare class AudioBuffering {
    constructor();
    private _chunks;
    push(chunkName: string, data: Float32Array): void;
    clear(): void;
    get(chunkName: string): Float32Array;
    private _mergeBuffers;
    private _objLen;
}
export declare const audioBuffering: AudioBuffering;
export default audioBuffering;
//# sourceMappingURL=AudioBuffering.d.ts.map