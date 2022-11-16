import AsyncStorage from '@react-native-community/async-storage';
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {useRecoilState} from 'recoil';
// import authAtom from "../state/authState";
// import userInfoAtom from "../state/userState";

// export const baseURL: string = "http://81.70.97.93";
export const baseURL: string = 'https://3901174m26.picp.vip';

// const [auth, setAuth] = useRecoilState(authAtom);
// const [user, setUser] = useRecoilState(userInfoAtom);

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
      // setUser(undefined);
      // setAuth(undefined);
      return Promise.reject(responseConfig.data);
    }
    return Promise.reject(responseConfig.data);
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  },
);

export default axiosInstance;
