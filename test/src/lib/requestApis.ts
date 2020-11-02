import axios, { AxiosRequestConfig } from 'axios';

import { LangConst } from '../../../src';
// import { LangConst } from '../../../docs/index';

class RequestApis {
  private API_BASE_URL: string;

  constructor() {
    //this.API_BASE_URL = 'http://localhost:8000';
    this.API_BASE_URL = 'https://backend-server-stt.jyugemu00.now.sh';
  }

  async mirai(lang: string, dataURL: string) {
    try {
      const config = [
        {
          lang: lang,
          profile: 'default' // defaultは固定値
        }
      ];
      if (LangConst.mirai('ja-JP').code !== lang) {
        // 指定された言語が日本語以外のときは、指定言語＋日本語でリクエストする
        config.push({
          lang: LangConst.mirai('ja-JP').code,
          profile: 'default' // defaultは固定値
        });
      }

      const axiosRequestConfig: AxiosRequestConfig = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8'
        },
        auth: {
          username: 'user_name',
          password: 'password123'
        }
      };
      const params = {
        audioData: dataURL,
        recognitionConfig: config
      };
      return await axios.post(
        this.API_BASE_URL + '/api/stt/mirai',
        params,
        axiosRequestConfig
      );
    } catch (error) {
      throw error;
    }
  }

  async gcp(lang: string, dataURL: string) {
    try {
      throw new Error('GoogleSTTは一時無効');
      const config = [
        {
          lang: lang,
          phrase: [] // 音声認識のヒント
        }
      ];
      if (LangConst.gcp('ja-JP').code !== lang) {
        // 指定された言語が日本語以外のときは、指定言語＋日本語でリクエストする
        config.push({
          lang: LangConst.gcp('ja-JP').code,
          phrase: []
        });
      }

      const axiosRequestConfig: AxiosRequestConfig = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8'
        },
        auth: {
          username: 'user_name',
          password: 'password123'
        }
      };
      const params = {
        audioData: dataURL,
        recognitionConfig: config
      };

      return await axios.post(
        this.API_BASE_URL + '/api/stt/gcp',
        params,
        axiosRequestConfig
      );
    } catch (error) {
      throw error;
    }
  }
}

const requestApis = new RequestApis();

export default requestApis;
