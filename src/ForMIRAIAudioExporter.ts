/**
 * 未来翻訳用オーディオデータ生成
 *
 * フォーマット
 * ├Linear PCM
 * ├サンプリングレート 16kHz
 * ├モノラル
 * ├ビックエンディアン
 * └ビットレート 16bit Signed
 */
export class ForMIRAIAudioExporter {
  /*constructor() {}*/

  /**
   * オーディオ（PCMデータ）データのエクスポート
   * @param {Float32Array} audioData
   * @returns {Blob}
   */
  exportPCM(audioData: Float32Array): Blob {
    const data = audioData.slice();
    const dataview = this._encodePCM(data);
    //return Buffer.from(dataview.buffer); // nodejsのとき
    return new Blob([dataview], { type: 'application/octet-stream' });
  }

  /**
   * オーディオ（PCMデータ）データにエンコード
   * @param {Float32Array} samples オーディオ（PCMデータ）データ
   * @returns {DataView}
   */
  private _encodePCM(samples: Float32Array): DataView {
    const offset = 0;
    const buffer = new ArrayBuffer(offset + samples.length * 2);
    const output = new DataView(buffer);
    return this._floatTo16BitPCM(offset, output, samples, false); // 16bit符号付き整数型、ビックエンディアンに変換
  }

  /**
   * 16bit符号付き整数型への変換
   * @param {number} offset
   * @param {DataView} output
   * @param {Float32Array} input
   * @param {boolean} littleEndian
   */
  private _floatTo16BitPCM(
    offset: number,
    output: DataView,
    input: Float32Array,
    littleEndian = true
  ): DataView {
    for (let i = 0, l = input.length; i < l; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      // 16bit符号付き整数型、ビックエンディアンで書き込む
      // https://lab.syncer.jp/Web/JavaScript/Reference/Global_Object/DataView/prototype/setInt16/
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, littleEndian);
    }
    return output;
  }
}

export const forMIRAIAudioExporter = new ForMIRAIAudioExporter();

export default forMIRAIAudioExporter;
