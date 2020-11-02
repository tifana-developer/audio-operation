import { EventEmitter } from 'events';

import window from './window';
import UserMediaStream from './UserMediaStream';

export class MediaManager extends EventEmitter {
  constructor() {
    super();
    this._mediaRecorder = null;
    this._processingFlg = false;
  }

  private _mediaRecorder: ReturnType<typeof window['MediaRecorder']>;
  private _processingFlg: boolean;

  get EVENT_START(): string {
    return 'mediaManager.start';
  }
  get EVENT_STOP(): string {
    return 'mediaManager.stop';
  }
  get EVENT_DATAAVAILABLE(): string {
    return 'mediaManager.dataavailable';
  }
  get EVENT_RESULT(): string {
    return 'mediaManager.result';
  }

  // https://qiita.com/walk8243/items/f618b839b9717171cc44
  on(event: string, listener: (...args: any[]) => void) {
    return super.on(event, listener); // 継承元を呼び出すだけでも処理を書く
  }

  emit(event: string, ...args: any[]) {
    return super.emit(event, ...args); // 処理を書く
  }

  eventResponse(
    result: { [s: string]: any } | string
  ): { result: { [s: string]: any } | string; flg: boolean } {
    return {
      result: result,
      flg: this._processingFlg
    };
  }

  start(): void {
    this.stop();
    if (!this._processingFlg) {
      UserMediaStream.get().then((mediaStream): void => {
        this.MediaRecording(mediaStream);
        this._processingFlg = true;
        super.emit(this.EVENT_START, this.eventResponse(''));
      });
    }
  }

  stop(): void {
    if (this._mediaRecorder && this._processingFlg) {
      this._mediaRecorder.stop();
      this._processingFlg = false;
      super.emit(this.EVENT_STOP, this.eventResponse(''));
    }
  }

  MediaRecorder(): ReturnType<typeof window['MediaRecorder']> {
    return window.MediaRecorder || undefined;
  }

  MediaRecording(mediaStream: MediaStream): void {
    const MediaRecorder = this.MediaRecorder();
    // MediaRecorderを使った音声認識処理
    if (MediaRecorder === undefined) {
      // IE11、Edgeは MediaRecorder がサポートされていないため、 MediaRecorder は undefined が返ってくる
      //throw new Error('[MediaRecorder]: This browser is not supported.');
      return;
    }
    this._mediaRecorder = new MediaRecorder(mediaStream);
    try {
      // let base64 = "";
      let _chunks: Array<Blob> = [];

      // メディアの記録を開始したときに発生する start イベントを処理するために呼び出される EventHandler です。
      this._mediaRecorder.addEventListener('start', (): void => {
        //console.log("start ->", event);
      });

      // MediaStream の終了時、または MediaRecorder.stop() メソッドの呼び出し後のいずれかに、メディアの記録が終了したときに発生する stop イベントを処理するために呼び出される EventHandler です。
      this._mediaRecorder.addEventListener('stop', (): void => {
        //console.time("Audio data processing time");
        //console.log("chunks->", chunks);
        const mimeType =
          _chunks.length && _chunks[0].type !== undefined
            ? _chunks[0].type
            : '';
        const webm = new Blob(_chunks, { type: mimeType });
        /*const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          base64 = reader.result; // 音声データの生成
          console.log(base64);
          console.timeEnd("Audio data processing time");
        };*/
        _chunks = [];
        const data = {
          originalAudio: webm
        };
        super.emit(this.EVENT_RESULT, this.eventResponse(data));
      });

      // timeslice のミリ秒単位のメディアが記録されるたびに（または timeslice が指定されていない場合はメディア全体が記録されると）定期的にトリガされる
      this._mediaRecorder.addEventListener(
        'dataavailable',
        (event: BlobEvent): void => {
          //console.log("dataavailable ->", event);
          if (event.data.size > 0) {
            _chunks.push(event.data);
            const data = {
              chunkData: event.data
            };
            super.emit(this.EVENT_DATAAVAILABLE, this.eventResponse(data));
          }
        }
      );

      // メディアの記録で発生したエラーの報告など、error イベントを処理するために呼び出される EventHandler です。
      this._mediaRecorder.addEventListener('error', (): void => {
        //console.log("error ->", event);
      });

      // メディアの記録が一時停止したときに発生する pause イベントを処理するために呼び出される EventHandler です。
      this._mediaRecorder.addEventListener('pause', (): void => {
        //console.log("pause ->", event);
      });

      // メディアの記録が一時停止後に再開したときに発生する resume イベントを処理するために呼び出される EventHandler です。
      this._mediaRecorder.addEventListener('resume', (): void => {
        //console.log("resume ->", event);
      });
    } catch (err) {
      throw new Error(err);
    }
    this._mediaRecorder.start(20);
  }
}

export const mediaManager = new MediaManager();

export default mediaManager;
