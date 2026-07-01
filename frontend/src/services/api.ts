import axios from 'axios';

// O Vite injeta variáveis de ambiente automaticamente.
// import.meta.env.DEV é "true" quando você roda 'npm run dev'
// e "false" quando você roda 'npm run build' (Produção).

const isDevelopment = import.meta.env.DEV;

export const api = axios.create({

  // Em produção, como estão no mesmo servidor, usa apenas '/api'.
  baseURL: isDevelopment ? 'http://localhost:3000/api' : import.meta.env.VITE_API_URL,
});
// Mantive o interceptor intacto para o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FinanceManager:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
