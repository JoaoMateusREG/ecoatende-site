import React, { useState } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from './axiosConfig'

// ----------------------------------------------------
// Componente para o campo de input (mantém a estética consistente)
interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  // Novo prop para CPF
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type, placeholder, value, onChange, required = true, maxLength, onBlur }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div>
      <label htmlFor={id} className='block text-base md:text-lg font-medium mb-2 md:mb-3'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <div className="relative">
        <input 
          type={inputType} 
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // Adiciona onBlur para formatação de CPF
          required={required}
          maxLength={maxLength}
          className='w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500 text-sm md:text-lg pr-12' 
          placeholder={placeholder} 
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};
// ----------------------------------------------------

// Funções utilitárias para CPF
const formatCpf = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const cleanCpf = (value: string) => {
  return value.replace(/\D/g, "");
};

// Componente Principal de Login e Cadastro
export default function LoginCadastro() {
  const [isLogin, setIsLogin] = useState(true);
  const [cpf, setCpf] = useState(''); // Alterado de 'email' para 'cpf'
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função que lida com a alteração do input e formata
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCpf(value);
    setCpf(formatted);
  };
  
  // Função que limpa o CPF ao sair do foco (opcional, mas bom para validação)
  const handleCpfBlur = () => {
    // Garante que o estado está formatado corretamente
    const cleaned = cleanCpf(cpf);
    if (cleaned.length === 11) {
      setCpf(formatCpf(cleaned));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanedCpf = cleanCpf(cpf);

    // --- Validações Básicas ---
    if (cleanedCpf.length !== 11) {
      setError("Por favor, insira um CPF válido (11 dígitos).");
      setLoading(false);
      return;
    }
    
    if (!password.trim()) {
      setError("A senha é obrigatória.");
      setLoading(false);
      return;
    }

    if (!isLogin && !nome.trim()) {
      setError("O nome é obrigatório para o cadastro.");
      setLoading(false);
      return;
    }
    // -------------------------

    try {
      if (isLogin) {
        // --- REQUISIÇÃO POST PARA LOGIN ---
        const response = await axios.post('/auth/site', {
          cpf: cleanedCpf,
          password: password,
        });

        // Simulação de uso de token ou dados do usuário
        console.log("Login bem-sucedido:", response.data);
        
        // Exemplo: Armazenar token no localStorage/Contexto e redirecionar
        // localStorage.setItem('token', response.data.token); 
        
        navigate('/dashboard'); // Redirecionar para a dashboard

      } else {
        // --- REQUISIÇÃO POST PARA CADASTRO ---
        const response = await axios.post('/auth/register', { // Altere o endpoint se necessário
          cpf: cleanedCpf,
          password: password,
          name: nome,
        });

        alert("Cadastro realizado com sucesso! Faça o login.");
        setIsLogin(true); // Após cadastro, volta para a tela de login
      }
    } catch (err: any) {
      const apiError = err.response?.data?.error || 'Erro na comunicação com o servidor. Tente novamente.';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const title = isLogin ? 'Acessar o EcoAtende' : 'Criar uma Nova Conta';
  const subtitle = isLogin ? 'Faça login com seu CPF para continuar' : 'Preencha os dados para se cadastrar';

  return (
    <div className="bg-black text-white min-h-screen w-full flex items-center justify-center p-4">
      <div className='absolute top-1/4 right-4 md:right-10 w-32 md:w-64 h-32 md:h-64 bg-blue-500/10 rounded-full blur-2xl md:blur-3xl'></div>
      <div className='absolute bottom-1/4 left-4 md:left-10 w-24 md:w-48 h-24 md:h-48 bg-purple-500/10 rounded-full blur-xl md:blur-2xl'></div>
      
      <div className="relative z-10 w-full max-w-md bg-white/5 rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
        
        {/* Header e Alternância */}
        <div className='text-center mb-6 md:mb-8'>
          <img src={'/EcoAtende-branco.png'} alt="logo" className='w-24 md:w-32 h-8 md:h-10 mx-auto mb-4' />
          <h2 className='text-2xl md:text-3xl font-bold mb-2'>
            {title}
          </h2>
          <p className='text-white/70 text-sm md:text-base'>{subtitle}</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
            </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
          
          {/* Campo NOME (Apenas para Cadastro) */}
          {!isLogin && (
            <InputField
              label="Nome Completo"
              id="nome"
              type="text"
              placeholder="Seu nome completo ou nome da empresa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          )}

          {/* Campo CPF (Substitui E-mail) */}
          <InputField
            label="CPF"
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            onBlur={handleCpfBlur}
            maxLength={14}
          />

          {/* Campo SENHA */}
          <InputField
            label="Senha"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Botão de Ação Principal */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 md:py-4 font-semibold rounded-lg md:rounded-xl transition-all text-sm md:text-base cursor-pointer flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-blue-600/50 text-white/70' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                {isLogin ? 'Acessando...' : 'Cadastrando...'}
              </>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </>
            )}
          </button>
        </form>

        {/* Link para Alternar Modo */}
        <div className='mt-6 pt-4 border-t border-white/10 text-center'>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              // Limpar campos ao trocar de modo
              setCpf('');
              setPassword('');
              setNome('');
              setError(null);
              setLoading(false);
            }}
            className='text-sm md:text-base text-white/70 hover:text-blue-400 transition-colors focus:outline-none'
          >
            {isLogin 
              ? 'Não tem uma conta? Cadastre-se agora!' 
              : 'Já tem uma conta? Faça login.'
            }
          </button>
        </div>
        
        {/* Link para Voltar à Página Inicial */}
        <div className='mt-4 text-center'>
            <Link 
                to='/' 
                className='text-xs text-white/50 hover:text-white transition-colors'
            >
                ← Voltar para a Home
            </Link>
        </div>
      </div>
    </div>
  );
}