import navigator from './navigator';

export class UserMediaStream {
  /**
   * mediaDevicesの取得
   * @returns {MediaDevices}
   */
  mediaDevices(): Navigator['mediaDevices'] {
    // JavaScriptからカメラやマイクなどの情報を取得
    // https://www.tmp1024.com/programming/change-javascript-navigator-getusermedia/
    return (
      navigator.mediaDevices ||
      (navigator.mozGetUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.msGetUserMedia
        ? {
            getUserMedia(c) {
              return new Promise((y, n) => {
                (
                  navigator.mozGetUserMedia || navigator.webkitGetUserMedia
                ).call(navigator, c, y, n);
              });
            }
          }
        : null)
    );
  }

  /**
   * mediaStreamの取得
   * @returns {Promise<MediaStream>}
   */
  get(): Promise<MediaStream> {
    const mediaDevices = this.mediaDevices();

    if (!mediaDevices) {
      // IE11は navigator.getUserMedia()、navigator.mediaDevices.getUserMedia() がサポートされていないため、 mediaDevices は null が返ってくる
      throw new Error(
        '[navigator.getUserMedia, navigator.mediaDevices.getUserMedia]: This browser is not supported.'
      );
    }

    // システム上で利用できる入出力メディアデバイスの情報を収集します。
    const mediaDevicesPromise = Promise.resolve().then(
      (): Promise<MediaDeviceInfo[]> => mediaDevices.enumerateDevices()
    );

    // AudioのみのmediaStreamを準備
    const mediaStreamPromise = mediaDevicesPromise.then(
      (mediaDeviceInfoList): Promise<MediaStream> => {
        //console.log("mediaDeviceInfoList ->", mediaDeviceInfoList);
        const audioDevices = mediaDeviceInfoList.filter(
          (deviceInfo): boolean => deviceInfo.kind === 'audioinput'
        );
        if (audioDevices.length < 1) throw new Error('no audioinput');
        //console.log("mediaDevices ->", mediaDevices);
        return mediaDevices.getUserMedia({
          audio: true
        });
      }
    );

    return mediaStreamPromise;
  }
}

export const userMediaStream = new UserMediaStream();

export default userMediaStream;
