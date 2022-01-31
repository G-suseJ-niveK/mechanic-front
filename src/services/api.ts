import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API, JWT_PREFIX } from '~config/environment';

const apiClient = axios.create({
  baseURL: `${HOST_API}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    enctype: 'application/json'
  }
});

// add Authorization
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = String(localStorage.getItem('token'));
    config.headers.Authorization = JWT_PREFIX + ' ' + token;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// interceptors
apiClient.interceptors.response.use(
  (response: any) => {
    // refresh token
    return response;
  },
  (error: any) => {
    const { response } = error;
    if (response?.status === 401 || response?.status === 412) {
      // token expired

      return; // Promise.reject(error);
    }

    if (response?.status === 403) {
      // Requiere autorizacion de headers

      return; // Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

//generar interceptors

export default {
  get(url: any) {
    return apiClient.get(url);
  },
  post(url: any, params: any) {
    return apiClient.post(url, params);
  },
  put(url: any, params: any) {
    return apiClient.put(url, params);
  },
  delete(url: any) {
    return apiClient.delete(url);
  }
};
