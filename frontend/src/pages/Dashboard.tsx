import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowUpCircle, ArrowDownCircle, Briefcase, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/transactions/dashboard')
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 401) handleLogout();
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@FinanceManager:token');
    navigate('/');
  };

  if (!data) return <div style={{ color: '#F8FAFC', textAlign: 'center', marginTop: '100px' }}>Processando dados contábeis...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px' }}>
      
      <header style={{ maxWidth: '1100px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600' }}>Finance Manager Enterprise</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Plataforma de Gestão Financeira Corporativa</p>
        </div>
        
        <button onClick={handleLogout} style={logoutButtonStyle}>
          <LogOut size={18} /> Encerrar Sessão
        </button>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
          
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={{ color: '#94A3B8' }}>Receitas Totais</span>
              <ArrowUpCircle size={24} color="#10B981" />
            </div>
            <p style={valueStyle}>R$ {data.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={{ color: '#94A3B8' }}>Despesas Operacionais</span>
              <ArrowDownCircle size={24} color="#EF4444" />
            </div>
            <p style={valueStyle}>R$ {data.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div style={{ ...cardStyle, backgroundColor: data.balance >= 0 ? '#1E3A8A' : '#7F1D1D' }}>
            <div style={cardHeaderStyle}>
              <span style={{ color: '#E2E8F0' }}>Fluxo de Caixa (Saldo)</span>
              <Briefcase size={24} color="#F8FAFC" />
            </div>
            <p style={valueStyle}>R$ {data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div style={actionsContainerStyle}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Gestão de Lançamentos</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/transactions/new')} style={primaryButtonStyle}>
              <PlusCircle size={20} /> Registrar Movimentação
            </button>
            <button onClick={() => navigate('/transactions')} style={secondaryButtonStyle}>
              <LayoutDashboard size={20} /> Relatório de Extrato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Estilos mantendo o padrão sóbrio corporativo
const cardStyle = { backgroundColor: '#1E293B', padding: '24px', borderRadius: '8px', flex: '1 1 300px', border: '1px solid #334155' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: '500' };
const valueStyle = { fontSize: '24px', fontWeight: '600' };
const actionsContainerStyle = { backgroundColor: '#1E293B', padding: '30px', borderRadius: '8px', border: '1px solid #334155' };
const logoutButtonStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#334155', color: '#F8FAFC', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer' };
const primaryButtonStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3B82F6', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' };
const secondaryButtonStyle = { ...primaryButtonStyle, backgroundColor: '#475569' };