// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Endereço do seu NestJS
} );

// Isso aqui coloca o Token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FinanceManager:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});