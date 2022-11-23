import AsyncStorage from '@react-native-community/async-storage';
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// export const baseURL: string = 'https://3901174m26.picp.vip/api/appClient';
export const baseURL: string = 'https://qianyushop.shop/api/appClient';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (requestConfig: AxiosRequestConfig) => {
    return requestConfig;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  async (responseConfig: AxiosResponse) => {
    if (responseConfig.data.code == 10000) {
      if (responseConfig.config.url === '/api/user/userLogin/magicApiJSON.do') {
        if (responseConfig.data.data.loginInfo.authInfo.blackList) {
          return Promise.reject({
            ...responseConfig.data,
            message: '环境异常',
          });
        }
        return Promise.resolve(responseConfig.data);
      }
      return Promise.resolve(responseConfig.data);
    }

    if (responseConfig.data.code == -14444) {
      AsyncStorage.removeItem('userInfo');
      AsyncStorage.removeItem('authInfo');
      return Promise.reject(responseConfig.data);
    }
    return Promise.reject(responseConfig.data);
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  },
);

export default axiosInstance;
