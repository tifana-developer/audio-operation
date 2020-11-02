import { EventEmitter } from 'events';

import window from './window';
import LangConst from './LangConst';

export class SpeechManager extends EventEmitter {
  constructor() {
    super();
    this._recognition = null;
    this._previousText = '';
    this._resultText = [];
    this._processingFlg = false;

    // 日本語、中国語（北京語、台湾語）、タイ語は文字列が連続するとそこで話し終わったとする。
    const overlapLangCode = [
      LangConst.gcp('ja', 'JP').code,
      LangConst.gcp('zh', 'CN').code,
      LangConst.gcp('zh', 'TW').code,
      LangConst.gcp('th', 'TH').code
    ];
    this._overlapLangCodeReg = new RegExp(
      '(' + overlapLangCode.filter(Boolean).join('|') + ')',
      'gi'
    );
  }

  private _recognition: ReturnType<typeof window['speechRecognition']>;
  private _previousText: string;
  private _resultText: Array<{ confidence: number; transcript: string }>;
  private _processingFlg: boolean;
  private _overlapLangCodeReg: RegExp;

  get EVENT_START(): string {
    return 'speechManager.start';
  }
  get EVENT_STOP(): string {
    return 'speechManager.stop';
  }
  get EVENT_DATAAVAILABLE(): string {
    return 'speechManager.dataavailable';
  }
  get EVENT_RESULT(): string {
    return 'speechManager.result';
  }
  get EVENT_CANCEL(): string {
    return 'speechManager.cancel';
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

  start(lang: string): void {
    this.stop();
    if (!this._processingFlg) {
      this._recognition = null;
      this.speechRecording(lang);
      super.emit(this.EVENT_START, this.eventResponse(''));
      this._processingFlg = true;
    }
  }

  stop(): void {
    if (this._recognition && this._processingFlg) {
      this._recognition.stop();
      if (this._previousText === '') {
        super.emit(this.EVENT_CANCEL, this.eventResponse('')); // EVENT_RESULTのほうが早くイベントが起きるので場所を変える
      } else {
        super.emit(this.EVENT_STOP, this.eventResponse(''));
      }
      this._previousText = '';
      this._resultText = [];
      this._processingFlg = false;
    }
  }

  isSpeechRecognition(): boolean {
    return this.speechRecognition() !== undefined;
  }

  speechRecognition(): ReturnType<typeof window['speechRecognition']> {
    // Speech Recognition APIを使う、無ければベンダープレフィックス付きを使う
    // https://caniuse.com/#feat=speech-recognition
    return (
      window.speechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.oSpeechRecognition ||
      undefined
    );
  }

  speechRecording(lang: string): void {
    const speechRecognition = this.speechRecognition();
    // speechRecognitionを使った音声認識処理
    if (speechRecognition === undefined) {
      return;
    }
    this._recognition = new speechRecognition();
    try {
      //let previous_text = "";
      //let result_text = [];
      //const p = document.createElement('p');
      //document.body.appendChild(p);

      this._recognition.lang = lang;
      this._recognition.continuous = true;
      this._recognition.interimResults = true;
      this._recognition.maxAlternatives = 10;

      /* SpeechGrammarListはまだChromeには実装されていないので無視される
      const grammar = '#JSGF V1.0; grammar colors; public <color> = 梨子田 | azure | beige ;'

      const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      this._recognition.grammars = speechRecognitionList;
      */

      // 音声認識でエラーが起こった時に発火します。
      this._recognition.addEventListener('error', (): void => {
        //console.log("error", event);
        this._recognition.abort();
        this._recognition.stop();
      });
      // 音声認識サービスが意味を認識できない最終結果を返した時に発火します。これは、ある程度の認識はされているが、信頼できるしきい値 (confidence) に達していないことを意味します。
      this._recognition.addEventListener('nomatch', (): void => {
        //console.log("nomatch", event);
      });

      // 音声認識サービスが結果を返した時に発火します。単語またはフレーズの認識結果が有意であり、アプリと通信してその結果が渡されます。
      this._recognition.addEventListener('result', (event: any): void => {
        //console.log("result", event);
        const textArr = [];

        //console.time("recognition processing time");
        // event.results.length = 1 以外検出されないが一応配列分ループさせる
        for (let i = 0, il = event.results.length; i < il; i++) {
          try {
            for (let j = 0, jl = event.results[i].length; j < jl; j++) {
              textArr.push({
                confidence: event.results[i][j].confidence,
                transcript: event.results[i][j].transcript
              });
            }
          } catch (err) {
            throw new Error(err);
          }
        }

        const isFinal = event.results[event.results.length - 1].isFinal;

        if (isFinal) {
          //console.timeEnd("recognition processing time");
          //console.log("result ->", textArr);
          this._resultText = Array.from(textArr);
          this._recognition.stop();
        } else {
          //console.timeEnd("recognition processing time");
          const data = [
            {
              candidate: textArr,
              lang: this._recognition.lang
            }
          ];
          super.emit(this.EVENT_DATAAVAILABLE, this.eventResponse(data));
          //console.log("Interim ->", textArr);
          //p.innerHTML = "Interim ->" + textArr.join('');
          // 同じテキストが続けば認識完了とする
          if (
            this._previousText === textArr[0].transcript &&
            this._overlapLangCodeReg.test(this._recognition.lang)
          ) {
            this._recognition.stop();
          }
          this._previousText = textArr[0].transcript;
        }
      });

      // 音声認識サービスが、現在の SpeechRecognition に関連付けられた文法の認識が意図された入力音声のリスニングを開始した時に発火します。
      this._recognition.addEventListener('start', (): void => {
        //console.log("▼音声認識スタート", event);
      });
      // 音声認識サービスとの接続が切れた時に発火します。
      this._recognition.addEventListener('end', (): void => {
        //console.log("▲音声認識終了", event);
        /*if (result_text.length > 0) {
          const p = document.createElement('p');
          p.innerHTML = "result ->" + result_text[0];
          document.body.appendChild(p);
        }*/
        const data = [
          {
            candidate: this._resultText,
            lang: this._recognition.lang
          }
        ];
        super.emit(this.EVENT_RESULT, this.eventResponse(data));
        this.stop();
      });

      // 音声認識サービスにより音声として認識された音が検出された時に発火します。
      this._recognition.addEventListener('speechstart', (): void => {
        //console.log("speechstart", event);
      });
      // 音声認識サービスにより認識された音声の停止が検出された時に発火します。
      this._recognition.addEventListener('speechend', (): void => {
        //console.log("speechend", event);
      });

      // 何らかの音が鳴った時 (認識可能な音声またはそうでない音が検知された時) に発火します。
      this._recognition.addEventListener('soundstart', (): void => {
        //console.log("soundstart", event);
      });
      // 何らかの音が鳴り止んだ時 (認識可能な音声またはそうでない音が止んだことが検知された時) に発火します。
      this._recognition.addEventListener('soundend', (): void => {
        //console.log("soundend", event);
      });

      // ユーザーエージェントが音声の捕捉を開始した時に発火します。
      this._recognition.addEventListener('audiostart', (): void => {
        //console.log("audiostart", event);
      });
      //ユーザーエージェントが音声の捕捉を終了した時に発火します。
      this._recognition.addEventListener('audioend', (): void => {
        //console.log("audioend", event);
      });
    } catch (err) {
      throw new Error(err);
    }
    this._recognition.start();
  }
}

export const speechManager = new SpeechManager();

export default speechManager;
