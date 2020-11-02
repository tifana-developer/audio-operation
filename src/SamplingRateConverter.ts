/**
 * サンプリングレートの変換処理クラス
 */
export class SamplingRateConverter {
  /**
   * サンプリングレート変換
   * @param {Float32Array} inputChannelData オーディオ（PCMデータ）データ
   * @param {number} fromSampleRate 変換前のサンプルレート
   * @param {number} toSampleRate 変換後のサンプルレート
   * @returns {Float32Array} 変換後のオーディオ（PCMデータ）データ
   */
  exec(
    inputChannelData: Float32Array,
    fromSampleRate: number,
    toSampleRate: number
  ): Float32Array {
    const data = inputChannelData.slice();
    // バッファーサイズをfromSampleRateからtoSampleRateに合わせたサイズへ変更
    const bufferSize = data.length * (toSampleRate / fromSampleRate);
    // サンプリングレート変換
    const resampleData = this.interpolateArray(data, bufferSize);
    const outputChannelData = this.buffering(resampleData, bufferSize); // Float32Array

    return outputChannelData;
  }

  /**
   * interpolate Array オーディオ（PCMデータ）データの足りない部分をバッファーサイズに合わせて補完する
   * https://stackoverflow.com/questions/27411835/web-audio-api-downsample-44-1-khz-in-javascript
   * @param {Float32Array} data オーディオ（PCMデータ）データ
   * @param {number} fitCount バッファーサイズ
   * @returns {Array<number>} 補完した配列データ
   */
  interpolateArray(data: Float32Array, fitCount: number): Array<number> {
    const linearInterpolate = (
      before: number,
      after: number,
      atPoint: number
    ) => {
      return before + (after - before) * atPoint;
    };
    const newData = [];
    const springFactor = Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0]; // for new allocation
    for (let i = 1; i < fitCount - 1; i++) {
      const tmp = i * springFactor;
      // const before = Number(Math.floor(tmp)).toFixed();
      // const after = Number(Math.ceil(tmp)).toFixed();
      const before = Number(Math.floor(tmp).toFixed());
      const after = Number(Math.ceil(tmp).toFixed());
      const atPoint = tmp - before;
      newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1]; // for new allocation
    return newData;
  }

  /**
   * ArrayをFloat32Arrayに変換
   * @param {Array<number>} input 配列データ
   * @param {number} fitCount 要素の数
   * @returns {Float32Array} Float32Arrayデータ
   */
  buffering(input: Array<number>, fitCount: number): Float32Array {
    const output = new Float32Array(fitCount);
    for (let i = 0; i < fitCount; i++) {
      output[i] = input[i];
    }
    return output;
  }
}

export const samplingRateConverter = new SamplingRateConverter();

export default samplingRateConverter;
