/**
 * ファイル変換系のクラス
 * 参考：http://var.blog.jp/archives/62330155.html
 */
export class Transformer {
  /**
   * blob -> ObjectURL
   * @param {Blob} blobData
   * @returns {string}
   */
  blob2ObjectURL(blobData: Blob): string {
    const URL = window.URL || window.webkitURL;
    return URL.createObjectURL(blobData);
  }

  /**
   * BinaryString -> DataURL
   * @param {string} binaryString
   * @param {string} [type = "application/octet-stream"] - MIME タイプ
   * @returns {string}
   */
  binaryString2dataURL(
    binaryString: string,
    type = 'application/octet-stream'
  ): string {
    return `data:${type},` + btoa(binaryString);
  }

  /**
   * DataURL -> BinaryString, type
   * @param {string} dataURL
   * @returns {Object.<string, string>}
   */
  dataURL2binaryString(
    dataURL: string
  ): { binaryString: string; type: string } {
    const str = dataURL.split(',');
    return {
      binaryString: atob(str[1]),
      type: str[0].replace(/(data:|;base64)/gi, '')
    };
  }

  /**
   * BinaryString, UintXXArray, ArrayBuffer -> Blob
   * @param {BlobPart} data
   * @param {string} [type = "application/octet-stream"] - MIME タイプ
   * @returns {Blob}
   */
  toBlob(data: BlobPart, type = 'application/octet-stream'): Blob {
    return new Blob([data], { type: type });
  }

  /**
   * DataURL -> Blob
   * @param {string} dataURL
   * @returns {Blob}
   */
  dataURL2Blob(dataURL: string): Blob {
    const { binaryString, type } = this.dataURL2binaryString(dataURL);
    return this.toBlob(binaryString, type);
  }

  /**
   * Blob -> ArrayBuffer, BinaryString, DataURL, text
   * @returns {Promise<void>}
   */
  private _readerPromise(reader: any): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
    });
  }

  /**
   * Blob -> ArrayBuffer
   * @param {Blob} blobData
   * @returns {Promise<string|ArrayBuffer>}
   */
  blob2ArrayBuffer(blobData: Blob): Promise<string | ArrayBuffer> {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blobData);
    return this._readerPromise(reader);
  }

  /**
   * Blob -> BinaryString
   * @param {Blob} blobData
   * @returns {Promise<string|ArrayBuffer>}
   */
  blob2BinaryString(blobData: Blob): Promise<string | ArrayBuffer> {
    const reader = new FileReader();
    reader.readAsBinaryString(blobData);
    return this._readerPromise(reader);
  }

  /**
   * Blob -> DataURL
   * @param {Blob} blobData
   * @returns {Promise<string|ArrayBuffer>}
   */
  blob2DataURL(blobData: Blob): Promise<string | ArrayBuffer> {
    const reader = new FileReader();
    reader.readAsDataURL(blobData);
    return this._readerPromise(reader);
  }

  /**
   * Blob -> text
   * @param {Blob} blobData
   * @returns {Promise<string|ArrayBuffer>}
   */
  blob2Text(blobData: Blob): Promise<string | ArrayBuffer> {
    const reader = new FileReader();
    reader.readAsText(blobData);
    return this._readerPromise(reader);
  }
}

export const transformer = new Transformer();

export default transformer;
