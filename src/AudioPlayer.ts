import { EventEmitter } from 'events';
import { Howl, Howler } from 'howler';

import window from './window';

export class AudioPlayer extends EventEmitter {
  private _sound: Howl | any;
  private _intervalId: ReturnType<typeof setInterval> | null;
  private _processingFlg: boolean;
  private _volume: number;
  private _mute: boolean;

  constructor() {
    super();
    this._sound = null;
    this._intervalId = null;
    this._processingFlg = false;
    this._volume = 1;
    this._mute = false;

    window.executeAudioSpeech = (audioFile: string): void =>
      this.audioSpeech(audioFile);
    window.executeSysAudio = (audioFile: string): void =>
      this.sysAudio(audioFile);

    // これがあるとiosでも制限回避して再生できる
    // https://github.com/goldfire/howler.js/
    const sound = new Howl({
      // 無音ファイル
      src: [
        'data:audio/mpeg;base64,UklGRnwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVgAAAAAAAAA//8CAP3/AwD+/wEA//8BAP7/AwD+/wAAAQD//wEA//8AAAEAAAD//wEA//8BAP//AQD//wEA//8BAP7/AwD9/wIA//8AAAAAAQD+/wIA/v8CAP//'
      ]
    });
    sound.once('load', (): void => {
      sound.on('playerror', (playerror): void => {
        console.log('playerror', playerror);
        sound.once('unlock', (unlockerror): void => {
          console.log('unlock', unlockerror);
          sound.play();
        });
      });
      sound.play();
    });

    // https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f#%E8%A7%A3%E6%B1%BA%E7%AD%96-1
    const MOUSEUP_EVENT =
      typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
    const initAudioContext = (): void => {
      document.removeEventListener(MOUSEUP_EVENT, initAudioContext);
      if (!Howler.ctx || !Howler.ctx.resume) {
        return;
      }
      // wake up AudioContext
      Howler.ctx.resume();
    };
    document.addEventListener(MOUSEUP_EVENT, initAudioContext);
  }

  get EVENT_START(): string {
    return 'audioPlayer.start';
  }
  get EVENT_STOP(): string {
    return 'audioPlayer.stop';
  }
  get EVENT_DATAAVAILABLE(): string {
    return 'audioPlayer.dataavailable';
  }
  get EVENT_MUTE(): string {
    return 'audioPlayer.mute';
  }
  get EVENT_PAUSE(): string {
    return 'audioPlayer.pause';
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

  // pause
  pause(): void {
    if (this._sound && this._sound.playing()) {
      this._sound.pause();
    }
  }
  pauseToggle(): void {
    if (this._sound && this._sound.playing()) {
      this._sound.pause();
    } else if (this._sound && !this._sound.playing()) {
      this._sound.play();
    }
  }

  // volume
  volume(volume: number): void {
    this._volume = volume;
    if (this._sound && this._sound.playing()) {
      this._sound.volume(this._volume);
    }
  }

  // mute
  mute(muted: boolean): void {
    this._mute = muted;
    if (this._sound && this._sound.playing()) {
      this._sound.mute(this._mute);
    }
  }
  muteToggle(): void {
    this._mute = !this._mute;
    if (this._sound && this._sound.playing()) {
      this._sound.mute(this._mute);
    }
  }

  /*AudioContext(): ReturnType<typeof window['AudioContext']> {
    return (
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext
    );
  }*/

  // ファイルからオーディオ再生
  sysAudio(src: string): void {
    const sound = new Howl({
      src: [src]
    });
    sound.play();
  }

  // ファイルから発話音声に変換（リップシンク付き）
  audioSpeech(src: string): void {
    if (this._sound && this._sound.playing()) {
      this._close();
    }

    this._sound = new Howl({
      src: [src],
      volume: this._volume,
      mute: this._mute
    });

    this._sound.on('load', (): void => {
      if (!this._sound.playing()) {
        this._sound.play();
      } else {
        this._sound.stop();
        this._sound.unload();
        this._sound.play();
      }
    });
    this._sound.on('play', (): void => {
      this._lipSync();
      this._processingFlg = true;
      super.emit(this.EVENT_START, this.eventResponse(''));
    });
    this._sound.on('end', (): void => {
      this._close();
      this._processingFlg = false;
      super.emit(this.EVENT_STOP, this.eventResponse(''));
    });
    this._sound.on('pause', (): void => {
      super.emit(this.EVENT_PAUSE, this.eventResponse(''));
    });
    this._sound.on('mute', (): void => {
      super.emit(this.EVENT_MUTE, this.eventResponse(''));
    });
  }

  private _lipSync(): void {
    if (!Howler.ctx || !Howler.ctx.createAnalyser) {
      return;
    }
    // Howlのビジュアライズの参考
    // https://github.com/calebomusic/freedm#visualizer
    const analyser = Howler.ctx.createAnalyser();
    Howler.masterGain.connect(analyser); // Howler.masterGain -> analyser

    const spectrums = new Uint8Array(analyser.frequencyBinCount);

    // 数値化の参考
    // https://co-lab.contents.ne.jp/20171227-193
    // https://nogson2.hatenablog.com/entry/2017/10/16/191205
    // https://mclab.uunyan.com/lab/html/audio003.htm

    analyser.fftSize = 128; // フーリエ変換を行う分割数。2の乗数でなくてはならない
    //analyser.minDecibels = -90;  //デシベル最小値
    //analyser.maxDecibels = 0; //デシベル最大値
    //analyser.smoothingTimeConstant = 0.2; // 周波数領域の波形 (振幅スペクトル) 描画に関連するプパティ 。時間的にスペクトルを平滑化させるのに用いられる

    /*console.log({
      fftSize: analyser.fftSize,
      minDecibels: analyser.minDecibels,
      maxDecibels: analyser.maxDecibels,
      smoothingTimeConstant: analyser.smoothingTimeConstant
    });*/

    //const lipSyncWeight = 2;
    const intervalHandler = (): void => {
      analyser.getByteFrequencyData(spectrums);
      let sum = 0;
      for (let i = 0, l = spectrums.length; i < l; i++) {
        sum += spectrums[i];
      }

      // ここの計算で口パクの仕方が変わる。0～１の間で推移させる。
      //const av = Math.round((sum / spectrums.length / 255) * lipSyncWeight * 100) / 100;
      const av = Math.round((sum / spectrums.length) * 10) / 100;
      //console.log(av);

      const data = {
        lipSyncValue: av
      };
      super.emit(this.EVENT_DATAAVAILABLE, this.eventResponse(data));
    };
    this._intervalId = setInterval(intervalHandler, 20);
  }

  private _close(): void {
    this._sound.stop();
    this._sound.unload();
    if (this._intervalId) clearInterval(this._intervalId);
  }
}

export const audioPlayer = new AudioPlayer();

export default audioPlayer;
