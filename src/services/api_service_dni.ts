import axios from 'axios';
import { HOST_API_RENIEC } from '~config/environment';

const apiClient = axios.create({
  baseURL: `${HOST_API_RENIEC}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

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
