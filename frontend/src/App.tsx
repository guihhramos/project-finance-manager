import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewTransaction } from './pages/NewTransaction';
import { Transactions } from './pages/Transactions'; // <--- IMPORTANTE: Adiciona esta linha
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/transactions/new" 
          element={
            <ProtectedRoute>
              <NewTransaction />
            </ProtectedRoute>
          } 
        />

        {/* Rota do Extrato que acabámos de criar */}
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;