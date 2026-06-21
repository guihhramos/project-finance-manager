import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Building2, Save, PlusCircle } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
}

export function NewTransaction() {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categories, setCategories] = useState<Category[]>([]);
    
    // Novos estados para controlar a criação de categorias
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
                
                // Seleciona a primeira categoria disponível do tipo atual, se houver
                const defaultCat = response.data.find((c: Category) => c.type === 'EXPENSE');
                if (defaultCat) {
                    setCategoryId(defaultCat.id);
                } else {
                    setIsAddingCategory(true); // Se não tem nenhuma, força a criar
                }
            } catch (err) {
                console.error('Erro ao carregar plano de contas/categorias', err);
            }
        }
        loadCategories();
    }, []);

    // Quando o usuário troca entre Receita/Despesa, reseta a categoria selecionada
    useEffect(() => {
        const firstOfNewType = categories.find(c => c.type === type);
        if (firstOfNewType) {
            setCategoryId(firstOfNewType.id);
            setIsAddingCategory(false);
        } else {
            setCategoryId('');
            setIsAddingCategory(true);
        }
    }, [type, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalCategoryId = categoryId;

            // Se o usuário escolheu criar uma categoria nova, salvamos ela primeiro no backend
            if (isAddingCategory && newCategoryName.trim() !== '') {
                const newCat = await api.post('/categories', {
                    name: newCategoryName,
                    type: type
                });
                finalCategoryId = newCat.data.id;
            }
            
            // Depois, cria a transação com o ID da categoria (nova ou existente)
            await api.post('/transactions', {
                title,
                amount: Number(amount),
                type,
                date: new Date(date).toISOString(),
                categoryId: finalCategoryId
            });

            alert('Movimentação lançada no fluxo de caixa com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            const apiErrorMessage = error.response?.data?.message;
            if (apiErrorMessage) {
                alert(apiErrorMessage); 
            } else {
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
                    {/* SEÇÃO DA CATEGORIA DINÂMICA */}
                    <div>
                        <label style={labelStyle}>Categoria / Centro de Custo</label>
                        <select
                            value={isAddingCategory ? 'NEW' : categoryId}
                            onChange={(e) => {
                                if (e.target.value === 'NEW') {
                                    setIsAddingCategory(true);
                                    setCategoryId('');
                                } else {
                                    setIsAddingCategory(false);
                                    setCategoryId(e.target.value);
                                }
                            }}
                            style={inputStyle}
                        >
                            {/* Lista as categorias que já existem no banco para o tipo selecionado */}
                            {categories
                                .filter(cat => cat.type === type)
                                .map(cat => (
                                    <option key={cat.id} value={cat.id} style={{ backgroundColor: '#1E293B' }}>
                                        {cat.name}
                                    </option>
                                ))
                            }
                            {/* A opção mágica que libera o input de texto */}
                            <option value="NEW" style={{ backgroundColor: '#0F172A', color: '#3B82F6', fontWeight: 'bold' }}>
                                + Criar nova categoria...
                            </option>
                        </select>

                        {/* Se ele escolheu "+ Criar nova categoria", mostra o input */}
                        {isAddingCategory && (
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlusCircle size={18} color="#3B82F6" />
                                <input
                                    type="text"
                                    placeholder="Digite o nome da nova categoria (ex: Folha de Pagamento)"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required={isAddingCategory}
                                    style={{ ...inputStyle, border: '1px dashed #3B82F6', backgroundColor: '#1E293B' }}
                                />
                            </div>
                        )}
                    </div>

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
const buttonStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', cursor: 'pointer', backgroundColor: '#3B82F6', color: '#F8FAFC', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '500', marginTop: '10px' };