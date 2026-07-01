import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // ==========================================
                // FLUXO DE LOGIN (ENTRAR)
                // ==========================================
                const response = await api.post('/auth/login', { email, password });

                // Guarda o token gerado pelo NestJS
                localStorage.setItem('@FinanceManager:token', response.data.access_token);

                // Vai direto para o Dashboard
                navigate('/dashboard');
            } else {
                // ==========================================
                // FLUXO DE CADASTRO (CRIAR CONTA)
                // ==========================================
                // 1. Envia os dados para a rota de criação do teu NestJS
                await api.post('/users', { email, password });

                // Mensagem de sucesso
                alert('Conta criada com sucesso! A entrar...');

                // 2. Faz o login automático logo a seguir para o utilizador não ter de digitar tudo de novo
                const loginResponse = await api.post('/auth/login', { email, password });

                // Guarda o token gerado
                localStorage.setItem('@FinanceManager:token', loginResponse.data.access_token);

                // Redireciona para o Dashboard
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error(error);

           
            if (isLogin) {
                alert('Erro ao fazer login. Verifica o teu e-mail e senha!');
            } else {
                // Se o backend devolver erro de e-mail duplicado
                if (error.response?.status === 409 || error.response?.data?.message?.includes('unique')) {
                    alert('Este e-mail já está registado! Tenta fazer login.');
                } else {
                    alert('Erro ao criar a conta. Certifica-se de que o backend está ligado.');
                }
            }
        }
    };

    return (
        <div style={{
            backgroundColor: '#1E293B',
            padding: '40px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Finance Manager</h1>
                <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                    {isLogin ? 'Controle Financeiro' : 'Crie a sua conta para começar'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />

                {/* 3. A mágica do Olhinho acontece aqui */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        type={showPassword ? "text" : "password"} // Muda o tipo dinamicamente
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ ...inputStyle, width: '100%', paddingRight: '40px' }} // paddingRight para o texto não ficar por baixo do ícone
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} // Inverte o estado ao clicar
                        style={{
                            position: 'absolute',
                            right: '12px',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            padding: 0
                        }}
                    >
                        {/* Mostra um ícone diferente dependendo se a senha está visível ou não */}
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                >
                    {isLogin ? 'Entrar' : 'Criar Conta'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
                <span style={{ color: '#94A3B8' }}>
                    {isLogin ? 'Não possui conta? ' : 'Já possui conta? '}
                </span>
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setEmail('');
                        setPassword('');
                        setName('');
                        setShowPassword(false); // Esconde a senha ao trocar de tela
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#3B82F6',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'inherit'
                    }}
                >
                    {isLogin ? 'Criar conta' : 'Fazer login'}
                </button>
            </div>

        </div>
    );
}

// Estilos
const inputStyle = {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
};

const buttonStyle = {
    padding: '12px',
    marginTop: '8px',
    cursor: 'pointer',
    backgroundColor: '#3B82F6',
    color: '#F8FAFC',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s',
};