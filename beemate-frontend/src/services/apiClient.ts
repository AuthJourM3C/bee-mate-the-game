import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

/**
 * Configured Axios instance for BeeMate API
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json'
  }
});

/** Request interceptor for logging */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

/** Response interceptor for error handling */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout');
    } else if (!error.response) {
      console.error('[API] Network error - server unreachable');
    } else {
      console.error(`[API] Error ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;