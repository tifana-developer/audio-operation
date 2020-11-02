export declare class SamplingRateConverter {
    exec(inputChannelData: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array;
    interpolateArray(data: Float32Array, fitCount: number): Array<number>;
    buffering(input: Array<number>, fitCount: number): Float32Array;
}
export declare const samplingRateConverter: SamplingRateConverter;
export default samplingRateConverter;
//# sourceMappingURL=SamplingRateConverter.d.ts.map