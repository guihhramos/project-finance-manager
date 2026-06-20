import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
    category: { name: string };
}

export function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadTransactions() {
            try {
                // Exemplo de como usar filtros e paginação na API (ajusta conforme a tua rota no NestJS)
                const response = await api.get(`/transactions?page=${page}&type=${typeFilter}`);
                setTransactions(response.data);
            } catch (err) {
                console.error('Erro ao buscar extrato', err);
            }
        }
        loadTransactions();
    }, [page, typeFilter]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px' }}>
                    <ArrowLeft size={16} /> Voltar ao Dashboard
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Extrato de Movimentações</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Filter size={18} color="#94A3B8" />
                        <select onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
                            <option value="">Todas as naturezas</option>
                            <option value="INCOME">Receitas</option>
                            <option value="EXPENSE">Despesas</option>
                        </select>
                    </div>
                </div>

                <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#0F172A', color: '#94A3B8', fontSize: '14px' }}>
                            <tr>
                                <th style={{ padding: '16px' }}>Data</th>
                                <th style={{ padding: '16px' }}>Justificativa</th>
                                <th style={{ padding: '16px' }}>Categoria</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(t => (
                                    <tr key={t.id} style={{ borderTop: '1px solid #334155' }}>
                                        <td style={{ padding: '16px' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ padding: '16px' }}>{t.title}</td>
                                        <td style={{ padding: '16px' }}>{t.category.name}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', color: t.type === 'INCOME' ? '#10B981' : '#EF4444' }}>
                                            {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                                        Nenhuma movimentação registada para este filtro.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de Paginação */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} style={navButtonStyle}><ChevronLeft size={20} /></button>
                    <span style={{ alignSelf: 'center' }}>Página {page}</span>
                    <button onClick={() => setPage(p => p + 1)} style={navButtonStyle}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
}

const selectStyle = { padding: '8px', borderRadius: '4px', backgroundColor: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' };
const navButtonStyle = { padding: '8px', backgroundColor: '#334155', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' };