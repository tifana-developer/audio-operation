import {
  SpeechManager,
  AudioManager,
  MediaManager,
  AudioPlayer,
  RecognitionNormalize,
  LangConst,
  Transformer,
  CodeIndex
} from '../../src';
//} from '../../docs-cjs/index';

import testAudioData from './lib/testAudioData';
import postFile from './lib/requestApis';

//console.log(LangConst.FULL_LIST);
//console.log(LangConst.GCP_LIST);
//console.log(LangConst.MIRAI_LIST);

let lang: CodeIndex = 'ja-JP';

// ボタンの作成
const createButton = (target: string, label: string) => {
  let ele = document.getElementById(target);
  if (ele) ele.parentNode.removeChild(ele);
  ele = document.createElement('input');
  ele.id = target;
  ele.name = target;
  ele.type = 'button';
  ele.value = label;
  ele.style.fontSize = '1.2em';
  ele.style.height = '2em';
  ele.style.lineHeight = '2em';
  document.body.appendChild(ele);
  return ele;
};

// セレクトボックスの作成
const createSelect = (target: string, label: string) => {
  let ele = document.getElementById(target);
  if (ele) ele.parentNode.removeChild(ele);
  ele = document.createElement('select');
  ele.id = target;
  ele.name = target;
  ele.style.fontSize = '1.2em';
  ele.style.height = '2em';
  ele.style.lineHeight = '2em';

  const langArr = LangConst.FULL_LIST;
  for (let i = 0; i < langArr.length; i++) {
    const op = document.createElement('option');
    op.value = langArr[i].code;
    op.text = langArr[i].label;
    ele.appendChild(op);
  }
  document.body.appendChild(ele);
  return ele;
};
createSelect('select_lang', 'lang').addEventListener('change', (e) => {
  lang = e.target.value;
  console.log('gcp lang ->', LangConst.gcp(lang).code);
  console.log('mirai lang ->', LangConst.mirai(lang).code);
});

// startボタン
createButton('btn_start', 'start').addEventListener('click', () => {
  // 音声認識
  SpeechManager.start(LangConst.gcp(lang).code);
  // Audiono録音
  AudioManager.start();
  // Media録音
  //MediaManager.start();
});

// stopボタン
createButton('btn_stop', 'stop').addEventListener('click', () => {
  SpeechManager.stop();
  if (!SpeechManager.isSpeechRecognition()) {
    AudioManager.stop();
    //MediaManager.stop();
  }
});

/* 音声認識 SpeechManager
    ---------------------------------------------------------------------- */
// 音声認識スタート
SpeechManager.on(SpeechManager.EVENT_START, (e) => {
  //console.log('EVENT_START ->', e);
});
// 音声認識ストップ
SpeechManager.on(SpeechManager.EVENT_STOP, (e) => {
  // console.log('EVENT_STOP ->', e);
  AudioManager.stop();
  //MediaManager.stop();
  // console.time('time: SpeechManager Request');
});
// 音声認識キャンセル
SpeechManager.on(SpeechManager.EVENT_CANCEL, (e) => {
  //console.log('EVENT_CANCEL ->', e);
  AudioManager.stop();
  //MediaManager.stop();
});
// 音声認識中
SpeechManager.on(SpeechManager.EVENT_DATAAVAILABLE, (e) => {
  // console.log('EVENT_DATAAVAILABLE ->', e);
});
// 音声認識の結果がでたとき
SpeechManager.on(SpeechManager.EVENT_RESULT, (e) => {
  console.log('EVENT_RESULT ->', e);
  // console.log('SpeechManager result ->', e.result);

  // 音声認識の信頼度が低い結果の中に辞書内のキーワードがあればそれを優先して返す
  const result = RecognitionNormalize.execute(
    RecognitionNormalize.DICT,
    e.result,
    LangConst.gcp(lang).code
  );

  // console.timeEnd('time: SpeechManager Request');
  console.log('normalize result ->', result);
  console.log('local result ->', e.result[0].candidate);

  const p = document.createElement('p');
  if (e.result[0].candidate.length > 0) {
    p.innerHTML = `local result : ${LangConst.gcp(lang).code} -> ${
      e.result[0].candidate[0].transcript
    }`;
    p.innerHTML += '<br />';
    p.innerHTML += `normalize result : ${
      LangConst.gcp(lang).code
    } -> ${result}`;
  } else {
    p.innerHTML = `local result : ${LangConst.gcp(lang).code} -> ${
      e.result[0].candidate
    }`;
  }
  document.body.appendChild(p);
});
/* ---------------------------------------------------------------------- */

/* Audio録音 AudioManager
    ---------------------------------------------------------------------- */
// Audio録音スタート
AudioManager.on(AudioManager.EVENT_START, (e) => {
  //console.log('EVENT_START ->', e);
});
// Audio録音ストップ
AudioManager.on(AudioManager.EVENT_STOP, (e) => {
  //console.log('EVENT_STOP ->', e);
});
// Audio録音中
AudioManager.on(AudioManager.EVENT_DATAAVAILABLE, (e) => {
  //console.log('EVENT_DATAAVAILABLE ->', e);
});
// Audio録音の結果がでたとき
AudioManager.on(AudioManager.EVENT_RESULT, (e) => {
  //console.log('EVENT_RESULT ->', e);
  console.log('AudioManager result ->', e.result);

  // 未来翻訳へのリクエスト
  Transformer.blob2DataURL(e.result.forMIRAIAudio).then((dataUrl) => {
    console.time('time: MIRAI REST Request');

    const url = Transformer.blob2ObjectURL(e.result.forMIRAIAudio); // DL用リンク生成
    const a = document.createElement('a');
    a.download = '未来翻訳用音声データ';
    a.innerHTML = '未来翻訳用音声データ';
    a.href = url;

    const p = document.createElement('p');
    postFile
      .mirai(LangConst.mirai(lang).code, dataUrl)
      .then((res) => {
        const result = res.data.results.FormatRecognition;
        //console.log(res.data);
        console.timeEnd('time: MIRAI REST Request');
        console.log('MIRAI REST result ->', result);

        const idx = result.findIndex(
          (item) => item.lang === LangConst.mirai(lang).code
        );

        if (result[idx].candidate.length > 0) {
          p.innerHTML = `MIRAI result : ${LangConst.mirai(lang).code} -> ${
            result[idx].candidate[0].transcript
          }<br />`;
        } else {
          p.innerHTML = `MIRAI result : ${
            LangConst.mirai(lang).code
          } -> ${JSON.stringify(res.data.results.Recognition[0].error)}<br />`;
        }
        p.appendChild(a);
        document.body.appendChild(p);
      })
      .catch((e) => {
        console.timeEnd('time: MIRAI REST Request');
        console.error(e);
        p.appendChild(a);
        document.body.appendChild(p);
      });
  });

  // Googleへのリクエスト
  Transformer.blob2DataURL(e.result.forGoogleSTTAudio).then((dataUrl) => {
    console.time('time: GoogleSTT REST Request');

    const url = Transformer.blob2ObjectURL(e.result.forGoogleSTTAudio); // DL用リンク生成
    const a = document.createElement('a');
    a.download = 'GoogleSTT用音声データ';
    a.innerHTML = 'GoogleSTT用音声データ';
    a.href = url;

    const p = document.createElement('p');
    postFile
      .gcp(LangConst.gcp(lang).code, dataUrl)
      .then((res) => {
        const result = res.data.results.FormatRecognition;
        //console.log(res.data);
        console.timeEnd('time: GoogleSTT REST Request');
        console.log('GoogleSTT REST result ->', result);

        const idx = result.findIndex(
          (item) => item.lang === LangConst.gcp(lang).code
        );

        p.innerHTML = `GoogleSTT result : ${LangConst.gcp(lang).code} -> ${
          result[idx].candidate[0].transcript
        }<br />`;
        p.appendChild(a);
        document.body.appendChild(p);
      })
      .catch((e) => {
        console.timeEnd('time: GoogleSTT REST Request');
        console.error(e);
        p.appendChild(a);
        document.body.appendChild(p);
      });
  });
});
/* ---------------------------------------------------------------------- */

/* Media録音 MediaManager
    ---------------------------------------------------------------------- */
// Media録音スタート
MediaManager.on(MediaManager.EVENT_START, (e) => {
  //console.log('EVENT_START ->', e);
});
// Media録音ストップ
MediaManager.on(MediaManager.EVENT_STOP, (e) => {
  //console.log('EVENT_STOP ->', e);
});
// Media録音中
MediaManager.on(MediaManager.EVENT_DATAAVAILABLE, (e) => {
  //console.log('EVENT_DATAAVAILABLE ->', e);
});
// Media録音の結果がでたとき
MediaManager.on(MediaManager.EVENT_RESULT, (e) => {
  //console.log('EVENT_RESULT ->', e);
  console.log('MediaManager result ->', e.result);
});
/* ---------------------------------------------------------------------- */

//AudioPlayer.audioSpeech(testAudioData.DATE2);
createButton('btn_play', 'play').addEventListener('click', () => {
  // テストデータの再生
  AudioPlayer.audioSpeech(testAudioData.DATE1);
});
createButton('btn_mute', 'mute').addEventListener('click', () => {
  // ミュート
  AudioPlayer.muteToggle();
});
createButton('btn_pause', 'pause').addEventListener('click', () => {
  // 一時停止
  AudioPlayer.pauseToggle();
});

/* 再生 AudioPlayer
    ---------------------------------------------------------------------- */
// 再生スタート
AudioPlayer.on(AudioPlayer.EVENT_START, (e) => {
  //console.log('EVENT_START ->', e);
});
// 再生終了
AudioPlayer.on(AudioPlayer.EVENT_STOP, (e) => {
  //console.log('EVENT_STOP ->', e);
});
// 再生中
AudioPlayer.on(AudioPlayer.EVENT_DATAAVAILABLE, (e) => {
  //console.log('EVENT_DATAAVAILABLE ->', e);
});
// 一時停止
AudioPlayer.on(AudioPlayer.EVENT_PAUSE, (e) => {
  // console.log('EVENT_PAUSE ->', e);
});
// ミュート
AudioPlayer.on(AudioPlayer.EVENT_MUTE, (e) => {
  // console.log('EVENT_MUTE ->', e);
});
/* ---------------------------------------------------------------------- */

const App = (): string => {
  return `音声認識、オーディオ再生　デモ`;
};

const rootElement = document.getElementById('root');
if (rootElement) rootElement.innerHTML = App();
