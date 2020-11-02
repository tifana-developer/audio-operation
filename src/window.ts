/**
 * Windowを継承したインターフェイス
 * https://sansaisoba.qrunch.io/entries/NrmnZGUHE3xZhO3a
 */
interface WindowEx extends Window {
  AudioContext: any;
  webkitAudioContext: any;
  mozAudioContext: any;
  oAudioContext: any;
  speechRecognition: any;
  webkitSpeechRecognition: any;
  mozSpeechRecognition: any;
  oSpeechRecognition: any;
  MediaRecorder: any;
  executeAudioSpeech: any;
  executeSysAudio: any;
}
declare const window: WindowEx;
export default window;
