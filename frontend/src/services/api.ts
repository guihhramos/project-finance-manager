import axios from 'axios';

// O Vite injeta variáveis de ambiente automaticamente.
// import.meta.env.DEV é "true" quando você roda 'npm run dev'
// e "false" quando você roda 'npm run build' (Produção).

const isDevelopment = import.meta.env.DEV;

export const api = axios.create({
  // Em desenvolvimento, o React (5173) chama o NestJS (3000).
  // Em produção, como estão no mesmo servidor, usa apenas '/api'.
  baseURL: isDevelopment ? 'http://localhost:3000/api' : '/api',
});

// Mantemos o seu interceptor intacto para o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FinanceManager:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
