// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import type { JSX } from 'react/jsx-runtime';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verifica se o crachá (token) existe no cofre do navegador
  const token = localStorage.getItem('@FinanceManager:token');

  // Se não tiver token, manda de volta para o Login instantaneamente
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se tiver token, deixa o usuário entrar e ver a página (children)
  return children;
}