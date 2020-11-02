/**
 * 音声認識の候補から辞書をもとに最適化した結果を返す
 */
export class RecognitionNormalize {
  get DICT(): { [s: string]: { [s: string]: Array<string> } } {
    return {
      PersonalName: {
        屋敷: [],
        梨子田: [],
        小森: []
      },
      PlaceName: {
        千駄ヶ谷: [],
        等々力: [],
        Maihama: [
          'my Hummer',
          'my Hama',
          'my Ama',
          'my Amma',
          'my Humma',
          'my Houma',
          'my homma',
          'my hamu',
          'my hammer',
          'my Amah'
        ]
      },
      Landmark: {
        'ecute(エキュート)': ['ecute', 'エキュート'],
        'VIEW ALTTE(ビューアルッテ)': ['VIEW ALTTE', 'ビューアルッテ'],
        'New Days(ニューデイズ)': ['New Days', 'ニューデイズ']
      }
    };
  }

  execute(
    dict: { [s: string]: { [s: string]: Array<string> } },
    recognitionResult: Array<{
      candidate: Array<{ confidence: number; transcript: string }>;
      lang: string;
    }>,
    langCode: string
  ): string {
    const i = recognitionResult.findIndex((item) => item.lang === langCode);
    const candidate = recognitionResult[i].candidate || [];
    if (candidate.length < 1) {
      return '';
    }
    let normalize = candidate[0].transcript;
    for (const k of Object.keys(dict)) {
      /*if (!(dict[k] instanceof Object && !(dict[k] instanceof Array))) {
        return candidate[0];
      }*/
      for (const m of Object.keys(dict[k])) {
        const keyword = dict[k][m];
        if (keyword.length === 0) keyword.push(m);
        const reg = new RegExp(
          '(' + keyword.filter(Boolean).join('|') + ')',
          'gi'
        );
        const i = candidate.findIndex((item) => reg.test(item.transcript));
        if (i !== -1) {
          normalize = candidate[i].transcript.replace(reg, m);
        }
      }
    }
    return normalize;
  }
}

export const recognitionNormalize = new RecognitionNormalize();

export default recognitionNormalize;
