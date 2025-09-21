import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    try {
      const response = await this.api.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async logout() {
    try {
      await this.api.post('/auth/signout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Get the configured axios instance for other services
  getApiInstance() {
    return this.api;
  }
}

const authService = new AuthService();
export default authService; 