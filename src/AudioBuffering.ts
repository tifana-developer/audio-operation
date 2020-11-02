/**
 * オーディオデータのバッファ操作系のクラス
 */
export class AudioBuffering {
  constructor() {
    this._chunks = {};
  }

  private _chunks: { [s: string]: Array<Float32Array> };

  /**
   * オーディオ（PCMデータ）データのchunkを格納して溜める
   * @param {string} chunkName 格納するchunkの名前
   * @param {Float32Array} data オーディオ（PCMデータ）データのchunk
   */
  push(chunkName: string, data: Float32Array): void {
    if (!(chunkName in this._chunks)) {
      this._chunks[chunkName] = [];
    }
    this._chunks[chunkName].push(data);
  }

  /**
   * すべてのchunkを開放
   */
  clear(): void {
    delete this._chunks;
    this._chunks = {};
  }

  /**
   * chunkに溜めたオーディオ（PCMデータ）データの取得
   * @param {string} chunkName 格納するchunkの名前
   * @returns {Float32Array} オーディオ（PCMデータ）データ
   */
  get(chunkName: string): Float32Array {
    if (!(chunkName in this._chunks)) {
      return new Float32Array(0);
    }
    return this._mergeBuffers(this._chunks[chunkName]);
  }

  /**
   * Float32Arrayが格納された配列を、一つにマージする
   * @param {Array.<Float32Array>} data Float32Arrayが格納された配列
   * @returns {Float32Array} オーディオ（PCMデータ）データ
   */
  private _mergeBuffers(data: Array<Float32Array>): Float32Array {
    let sampleLength = 0;
    for (let i = 0, l = data.length; i < l; i++) {
      sampleLength += this._objLen(data[i]);
    }
    const samples = new Float32Array(sampleLength);
    let sampleIndex = 0;
    for (let i = 0, l = data.length; i < l; i++) {
      for (let j = 0, m = this._objLen(data[i]); j < m; j++) {
        samples[sampleIndex] = data[i][j];
        sampleIndex += 1;
      }
    }
    return samples;
  }

  /**
   * オブジェクトのプロパティ数を返す
   * @param {Float32Array} obj
   * @returns {number} オブジェクトのプロパティ数
   */
  private _objLen(obj: Float32Array): number {
    return Object.keys(obj).length;
  }
}

export const audioBuffering = new AudioBuffering();

export default audioBuffering;
