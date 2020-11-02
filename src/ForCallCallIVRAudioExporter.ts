/**
 * CallCall-IVR用オーディオデータ生成
 *
 * フォーマット
 * ├WAV
 * ├サンプリングレート 8kHz
 * ├モノラル
 * └ビットレート 16bit
 */

import WavEncoder from 'wav-encoder';

export class ForCallCallIVRAudioExporter {
  constructor() {
    // https://github.com/mohayonao/wav-encoder
    this._whiteNoise1sec = {
      sampleRate: 8000, // サンプリングレート（Hz）
      channelData: []
    };
    this._opts = {
      bitDepth: 16, // ビット深度（bit）
      float: false,
      symmetric: false
    };
  }

  private _whiteNoise1sec: WavEncoder.AudioData;
  private _opts: WavEncoder.Options | undefined;

  /**
   * オーディオ（WAVデータ）データのエクスポート
   * @param {Float32Array} audioData
   * @returns {Blob}
   */
  exportWAV(audioData: Float32Array): Blob {
    const data = audioData.slice();
    this._whiteNoise1sec.channelData[0] = data;
    const ArrayBuffer = WavEncoder.encode.sync(
      this._whiteNoise1sec,
      this._opts
    );
    //return Buffer.from(dataview.buffer); // nodejsのとき
    return new Blob([ArrayBuffer], { type: 'audio/wav' });
  }
}

export const forCallCallIVRAudioExporter = new ForCallCallIVRAudioExporter();

export default forCallCallIVRAudioExporter;
