/**
 * Navigatorを継承したインターフェイス
 * https://sansaisoba.qrunch.io/entries/NrmnZGUHE3xZhO3a
 */
interface NavigatorEx extends Navigator {
  mediaDevices: any;
  mozGetUserMedia: any;
  webkitGetUserMedia: any;
  msGetUserMedia: any;
}
declare const navigator: NavigatorEx;
export default navigator;
