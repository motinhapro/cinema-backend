import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native'; 

const API_URL = 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição (Anexa o token antes de enviar a chamada)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Se for Web busca no localStorage, se for Mobile usa o SecureStore
      const token = Platform.OS === 'web'
        ? localStorage.getItem('auth-token')
        : await SecureStore.getItemAsync('auth-token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Erro ao buscar token no interceptor:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta (Trata erros globais, como Token Expirado/401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Limpa o token de acordo com a plataforma se a sessão cair
        if (Platform.OS === 'web') {
          localStorage.removeItem('auth-token');
        } else {
          await SecureStore.deleteItemAsync('auth-token');
        }
      } catch (err) {
        console.error('Erro ao limpar token expirado:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;