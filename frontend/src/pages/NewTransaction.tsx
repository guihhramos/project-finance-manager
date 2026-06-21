import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Building2, Save } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
}

export function NewTransaction() {
    const [title, setTitle] = useState(''); // Representará a Justificativa/Descrição interna
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE'); // Padrão corporativo geralmente inicia em despesa
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
                if (response.data.length > 0) {
                    setCategoryId(response.data[0].id);
                }
            } catch (err) {
                console.error('Erro ao carregar plano de contas/categorias', err);
            }
        }
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalCategoryId = categoryId;

            // Se a empresa ainda não tiver as categorias corporativas, o MVP cria a correta sob demanda
            if (categories.length === 0) {
                const defaultName = type === 'INCOME' ? 'Receitas de Clientes' : 'Despesas Operacionais';
                const newCat = await api.post('/categories', {
                    name: defaultName,
                    type: type
                });
                finalCategoryId = newCat.data.id;
            }
            
            await api.post('/transactions', {
                title,
                amount: Number(amount),
                type,
                date: new Date(date).toISOString(), // Isto garante que a string vira data real
                categoryId: finalCategoryId
            });

            alert('Movimentação lançada no fluxo de caixa com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            
            // Captura a mensagem de erro específica enviada pelo NestJS
            const apiErrorMessage = error.response?.data?.message;

            if (apiErrorMessage) {
                // Exibe exatamente: "Operação bloqueada: Saldo insuficiente para realizar esta despesa."
                alert(apiErrorMessage); 
            } else {
                // Fallback caso seja outro tipo de erro de rede ou servidor
                alert('Falha ao registrar lançamento corporativo.');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#1E293B', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '550px', border: '1px solid #334155' }}>

                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', padding: 0 }}
                >
                    <ArrowLeft size={16} /> Voltar ao Painel Corporativo
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Building2 size={24} color="#3B82F6" />
                    <h1 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>Registro de Movimentação Interna</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div>
                        <label style={labelStyle}>Descrição / Justificativa do Lançamento</label>
                        <input
                            type="text"
                            placeholder="Ex: NF-e 4502 - Aquisição de insumos ou Reembolso de viagem"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Valor do Lançamento (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Data Contábil</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Natureza da Operação</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
                            style={inputStyle}
                        >
                            <option value="EXPENSE" style={{ backgroundColor: '#1E293B' }}>Despesa (Operacional / Reembolso)</option>
                            <option value="INCOME" style={{ backgroundColor: '#1E293B' }}>Receita (Clientes / Aportes)</option>
                        </select>
                    </div>

                    {categories.length > 0 && (
                        <div>
                            <label style={labelStyle}>Categoria / Centro de Custo</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                style={inputStyle}
                            >
                                {categories
                                    .filter(cat => cat.type === type)
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id} style={{ backgroundColor: '#1E293B' }}>
                                            {cat.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    )}

                    <button type="submit" style={buttonStyle}>
                        <Save size={18} />
                        Efetivar Lançamento Contábil
                    </button>

                </form>
            </div>
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#94A3B8', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#F8FAFC', fontSize: '14px', outline: 'none' };
const buttonStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', cursor: 'pointer', backgroundColor: '#3B82F6', color: '#F8FAFC', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '500' };