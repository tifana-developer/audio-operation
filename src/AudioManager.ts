import { EventEmitter } from 'events';

import window from './window';
import AudioBuffering from './AudioBuffering';
import SamplingRateConverter from './SamplingRateConverter';
import ForMIRAIAudioExporter from './ForMIRAIAudioExporter';
import ForCallCallIVRAudioExporter from './ForCallCallIVRAudioExporter';
import ForGoogleSTTAudioExporter from './ForGoogleSTTAudioExporter';
import UserMediaStream from './UserMediaStream';

export class AudioManager extends EventEmitter {
  constructor() {
    super();
    this._audioContext = null;
    this._processor = null;
    this._input = null;
    this._globalStream = null;
    this._processingFlg = false;
    this._gainNode = null;
    this.GAIN_VALUE = 1000; // ゲイン値を1000%（10倍）にする
  }

  private _audioContext: AudioContext | any;
  private _processor: ScriptProcessorNode | any;
  private _input: MediaStreamAudioSourceNode | any;
  private _globalStream: MediaStream | any;
  private _processingFlg: boolean;
  private _gainNode: GainNode | any;
  private GAIN_VALUE: number;

  get EVENT_START(): string {
    return 'audioManager.start';
  }
  get EVENT_STOP(): string {
    return 'audioManager.stop';
  }
  get EVENT_DATAAVAILABLE(): string {
    return 'audioManager.dataavailable';
  }
  get EVENT_RESULT(): string {
    return 'audioManager.result';
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
      // ios safariで Web Audio APIを動かすため、先にaudioContextを生成してから、UserMediaを生成する
      this._audioContext = this.AudioContext();

      UserMediaStream.get().then((mediaStream) => {
        this.AudioRecording(mediaStream);
        this._processingFlg = true;
        super.emit(this.EVENT_START, this.eventResponse(''));
      });
    }
  }

  stop(): void {
    if (this._processingFlg) {
      this._close();
      this._processingFlg = false;
      super.emit(this.EVENT_STOP, this.eventResponse(''));
    }
  }

  AudioContext(): ReturnType<typeof window['AudioContext']> {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext;
    if (AudioContext === undefined) {
      return;
    }
    return new AudioContext();
  }

  AudioRecording(mediaStream: MediaStream): void {
    /*const AudioContext = this.AudioContext();
    if (AudioContext === undefined) {
      return;
    }
    this._audioContext = new AudioContext();
    */
    this._processor = this._audioContext.createScriptProcessor(0, 1, 1); // 引数の参考→https://developer.mozilla.org/ja/docs/Web/API/AudioContext/createScriptProcessor#Parameters\
    this._processor.connect(this._audioContext.destination);
    this._audioContext.resume();

    const oldSampleRate = this._audioContext.sampleRate; // サンプルレートの取得。OS、ブラウザによってデフォルトのサンプリングレートは決まっている（44.1kHzになるはず）

    this._globalStream = mediaStream;
    this._input = this._audioContext.createMediaStreamSource(mediaStream);
    //this._input.connect(this._processor);
    this._gainNode = this._audioContext.createGain(); // 音量を大きくする
    this._gainNode.gain.value = this.GAIN_VALUE / 100;
    this._gainNode.connect(this._processor);
    this._input.connect(this._gainNode);

    this._processor.addEventListener(
      'audioprocess',
      (audio: AudioProcessingEvent): void => {
        const inputChannelData = audio.inputBuffer.getChannelData(0); // モノラル (0が左チャンネル, 1が右チャンネルです). ただし, インスタンス生成において, 入力チャンネル数に1を指定 (第2引数) している場合には, 左チャンネルからの入力データしか取得できない

        const audio16khz = SamplingRateConverter.exec(
          inputChannelData,
          oldSampleRate,
          16000
        );
        const audio8khz = SamplingRateConverter.exec(
          inputChannelData,
          oldSampleRate,
          8000
        );

        AudioBuffering.push('originalAudio', inputChannelData);
        AudioBuffering.push('audio16khz', audio16khz);
        AudioBuffering.push('audio8khz', audio8khz);

        const data = {
          chunkData: inputChannelData,
          audio16khz: audio16khz,
          audio8khz: audio8khz
        };
        super.emit(this.EVENT_DATAAVAILABLE, this.eventResponse(data));
      }
    );
  }

  private _close(): void {
    this._result();

    const track = this._globalStream.getTracks()[0];
    track.stop();
    AudioBuffering.clear();
    //this._input.disconnect(this._processor);
    this._input.disconnect(this._gainNode);
    this._processor.disconnect(this._audioContext.destination);
    this._audioContext.close().then((): void => {
      this._input = null;
      this._processor = null;
      this._audioContext = null;
      this._gainNode = null;
    });
  }

  private _result(): void {
    console.time('time: Audio Convert');
    const originalAudio = AudioBuffering.get('originalAudio');
    const pcmOriginal = ForMIRAIAudioExporter.exportPCM(originalAudio);
    const wavOriginal = ForCallCallIVRAudioExporter.exportWAV(originalAudio);

    const audio16khz = AudioBuffering.get('audio16khz');
    const pcm16khz = ForMIRAIAudioExporter.exportPCM(audio16khz);
    //const wav16khz = ForCallCallIVRAudioExporter.exportWAV(audio16khz);
    const wav16khz = ForGoogleSTTAudioExporter.exportWAV(audio16khz);

    const audio8khz = AudioBuffering.get('audio8khz');
    //const pcm8khz = ForMIRAIAudioExporter.exportWAV(audio8khz);
    const wav8khz = ForCallCallIVRAudioExporter.exportWAV(audio8khz);

    //console.log('pcm->', pcm);
    //console.log('wav->', wav);

    //this.DLConsole(pcm);
    //this.DLConsole(wav16khz);

    console.timeEnd('time: Audio Convert');
    const data = {
      pcmOriginal: pcmOriginal,
      wavOriginal: wavOriginal,
      forMIRAIAudio: pcm16khz,
      forCallCallIVRAudio: wav8khz,
      forGoogleSTTAudio: wav16khz
    };
    super.emit(this.EVENT_RESULT, this.eventResponse(data));
  }
}

export const audioManager = new AudioManager();

export default audioManager;
