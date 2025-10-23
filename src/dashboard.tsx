import { useState, useEffect } from 'react';
import { User, ClipboardList, DollarSign, Calendar, ArrowRight, X, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ===================================================================
//              *** CONFIGURAÇÕES DA API ***
// ===================================================================

// URL base da API (usando sandbox para desenvolvimento)
const BASE_URL = 'https://api-sandbox.asaas.com/v3';

// API Key do sandbox (extraída do axiosConfig.ts)
const SANDBOX_API_KEY = 'aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRlMDY2NDY1LThjMjktNGVjOS1hMGQyLTVkNmUzNGVmYmYzZDo6JGFhY2hfZGFjMjk0MzgtZDc1MS00NDgwLTgwOGMtZDBjNThhN2NiMTA0';

// Função para buscar dados da organização do localStorage
const getOrganizationData = () => {
  try {
    const storedData = localStorage.getItem('organizationData');
    if (!storedData) {
      throw new Error('Dados da organização não encontrados. Faça login novamente.');
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Erro ao recuperar dados da organização:', error);
    throw error;
  }
};

// Função para limpar dados do localStorage
const clearOrganizationData = () => {
  localStorage.removeItem('organizationData');
};

// Função para criar instância do axios com API key do sandbox
const createAsaasApi = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'access_token': SANDBOX_API_KEY,
      'Content-Type': 'application/json',
    },
  });
};

// ===================================================================
//                    *** FUNÇÕES DE AJUDA ***
// ===================================================================

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/**
 * Traduz o tipo de faturação (billingType) da API para o português.
 */
const formatBillingType = (type: string | null | undefined) => {
    if (!type) return 'Não Definido';

    switch (type) {
        case 'BOLETO':
            return 'Boleto';
        case 'CREDIT_CARD':
            return 'Cartão de Crédito';
        case 'PIX':
            return 'Pix';
        case 'UNDEFINED':
            return 'Não Definido';
        default:
            // Remove underscores (ex: DEBIT_CARD -> DEBIT CARD) e capitaliza o primeiro
            const formatted = type.toLowerCase().replace(/_/g, ' ');
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
};

/**
 * Função auxiliar para traduzir o status da API para o português
 */
const formatStatus = (status: string) => {
    switch (status) {
        case 'ACTIVE': return 'Ativa';
        case 'PENDING': return 'Pendente';
        case 'CANCELED': return 'Cancelada';
        case 'PAID': return 'Pago';
        case 'RECEIVED': return 'Pago'; // Status comum no Asaas
        case 'CONFIRMED': return 'Pago'; // Status comum no Asaas
        case 'FAILED': return 'Falhado';
        case 'REFUNDED': return 'Estornado';
        default: return status;
    }
}


// ===================================================================
//                  *** COMPONENTE PRINCIPAL ***
// ===================================================================
export default function Dashboard() {
  const [userData, setUserData] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [payments, setPayments] = useState<any[]>([]); 
  const [organizationData, setOrganizationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Função para fazer logout
  const handleLogout = () => {
    clearOrganizationData();
    navigate('/login');
  };
  
  /**
   * Mapeamento de status para cores
   */
  const statusColorMap: { [key: string]: string } = {
    ACTIVE: 'text-green-400 bg-green-500/20',
    PENDING: 'text-yellow-400 bg-yellow-500/20',
    CANCELED: 'text-red-400 bg-red-500/20',
    PAID: 'text-green-400 bg-green-500/20',
    RECEIVED: 'text-green-400 bg-green-500/20', 
    CONFIRMED: 'text-green-400 bg-green-500/20',
    FAILED: 'text-red-400 bg-red-500/20',
    REFUNDED: 'text-yellow-400 bg-yellow-500/20',
  };

  /**
   * Lógica de Carregamento de Dados da API do Asaas
   * Usa os dados da organização armazenados no localStorage após o login.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Recuperar dados da organização do localStorage
        const orgData = getOrganizationData();
        setOrganizationData(orgData);
        
        console.log("Dados da organização carregados:", orgData);
        
        // 2. Verificar se temos os dados necessários
        if (!orgData.customerId) {
          setError("⚠️ Organização não possui customerId configurado. Entre em contato com o suporte para configurar a integração com o Asaas.");
          setLoading(false);
          return;
        }
        
        // 3. Verificar se temos subscription ID (está no array subscription)
        const subscriptionId = orgData.subscription && orgData.subscription.length > 0 ? orgData.subscription[0].id : null;
        console.log("Subscription ID encontrado:", subscriptionId);
        console.log("Array subscription:", orgData.subscription);
        
        if (!subscriptionId) {
          setError("⚠️ Organização não possui subscriptionId configurado. Entre em contato com o suporte para configurar a integração com o Asaas.");
          setLoading(false);
          return;
        }
        
        // 4. Criar instância do axios com API key do sandbox
        const asaasApi = createAsaasApi();
        
        // 5. Buscar dados do Asaas usando os dados da organização
        const [customerResponse, subscriptionResponse, paymentsResponse] = await Promise.all([
            // 1. Dados do Cliente
            asaasApi.get(`/customers/${orgData.customerId}`),
            // 2. Detalhes da Assinatura
            asaasApi.get(`/subscriptions/${subscriptionId}`),
            // 3. Pagamentos da Assinatura
            asaasApi.get(`/subscriptions/${subscriptionId}/payments`),
        ]);

        setUserData(customerResponse.data);
        setSubscription(subscriptionResponse.data);
        // A API de pagamentos retorna um objeto com a lista em 'data'
        setPayments(paymentsResponse.data.data); 
        
      } catch (err: any) {
        // Tratamento de erro da API
        const errorMessage = err.response && err.response.data && err.response.data.errors 
                             ? err.response.data.errors.map((e: any) => e.description).join(', ')
                             : err.message || "Erro desconhecido na API. Verifique o console.";
        
        console.error("Erro na API:", err.response ? err.response.data : err.message);
        setError(`Falha ao carregar dados. Detalhe: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) {
    return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
            <h2 className="text-xl text-white/70">Carregando dados da organização e dashboard...</h2>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-8">
            <X size={48} className='text-red-500 mb-4' />
            <h2 className='text-2xl font-bold text-red-500 mb-2'>Erro de Conexão</h2>
            <p className='text-white/70 text-center'>{error}</p>
            <p className='text-xs text-white/50 mt-4'>Verifique se a organização possui os dados necessários (customerId, subscriptionId).</p>
        </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8 md:mb-12'>
          <h1 className='text-4xl font-bold'>
            Dashboard - {organizationData?.name || 'Conta'}
          </h1>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors'
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          {/* Seção 1: Dados Cadastrais */}
          <div className='lg:col-span-1 bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg h-min'>
            <div className='flex items-center gap-3 mb-4 border-b border-white/10 pb-3'>
              <User size={24} className='text-blue-400' />
              <h2 className='text-xl font-semibold'>Seus Dados</h2>
            </div>
            
            <div className='space-y-4 text-sm md:text-base'>
              {/* Nome */}
              <div>
                <p className='text-white/70'>Nome do estabelecimento</p>
                <p className='font-medium text-lg'>{userData?.name}</p>
              </div>
              
              {/* CPF / CNPJ */}
              <div>
                {/* Verifica o tipo de pessoa para mostrar CPF ou CNPJ */}
                <p className='text-white/70'>{userData?.personType === 'JURIDICA' ? 'CNPJ' : 'CPF'}</p>
                <p className='font-medium'>{userData?.cpfCnpj}</p>
              </div>
              
              {/* Email */}
              <div>
                <p className='text-white/70'>Email</p>
                <p className='font-medium'>{userData?.email}</p>
              </div>

              <button className='w-full mt-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors'>
                Editar Perfil
              </button>
            </div>
          </div>
          
          {/* Seção 2: Assinatura e Pagamentos */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Card de Assinatura */}
            <div className='bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-blue-500/30 shadow-lg'>
              <div className='flex items-center justify-between border-b border-white/10 pb-3 mb-4'>
                <div className='flex items-center gap-3'>
                  <ClipboardList size={24} className='text-purple-400' />
                  <h2 className='text-xl font-semibold'>Detalhes da Assinatura</h2>
                </div>
                {subscription?.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColorMap[subscription.status]}`}>
                    {formatStatus(subscription.status)}
                  </span>
                )}
              </div>
              
              {subscription && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base'>
                  
                  {/* Plano/Método de Pagamento */}
                  <div>
                    <p className='text-white/70'>Método de pagamento</p>
                    <p className='text-lg font-bold text-blue-400'>
                        {formatBillingType(subscription.billingType)}
                    </p>
                  </div>

                  {/* Valor */}
                  <div>
                    <p className='text-white/70'>Valor Mensal</p>
                    <p className='font-medium text-lg'>{formatCurrency(subscription.value)}</p>
                  </div>
                  
                  {/* Renovação */}
                  <div className='flex flex-col justify-between'>
                    <div>
                      <p className='text-white/70'>Próxima Renovação</p>
                      <div className='flex items-center gap-2'>
                        <Calendar size={16} className='text-purple-400' />
                        <p className='font-medium'>{formatDate(subscription.nextDueDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className='mt-6 pt-4 border-t border-white/10'>
                 <button className='flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm'>
                    Gerenciar Pagamento
                    <ArrowRight size={16} />
                 </button>
              </div>
            </div>

            {/* Tabela de Pagamentos */}
            <div className='bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg'>
              <div className='flex items-center gap-3 mb-4 border-b border-white/10 pb-3'>
                <DollarSign size={24} className='text-green-400' />
                <h2 className='text-xl font-semibold'>Histórico de Pagamentos</h2>
              </div>
              
              <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='text-sm uppercase text-white/50'>
                      <th className='p-3 font-medium'>ID da Transação</th>
                      <th className='p-3 font-medium'>Data</th>
                      <th className='p-3 font-medium'>Valor</th>
                      <th className='p-3 font-medium'>Método</th>
                      <th className='p-3 font-medium'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan={5} className='p-3 text-center text-white/50'>Nenhum pagamento encontrado.</td>
                        </tr>
                    ) : (
                        payments.map((p) => (
                          <tr key={p.id} className='border-t border-white/5 hover:bg-white/10 transition-colors'>
                            <td className='p-3 text-sm font-mono'>{p.id}</td>
                            <td className='p-3 text-sm'>{formatDate(p.dateCreated)}</td> 
                            <td className='p-3 text-sm font-semibold'>{formatCurrency(p.value)}</td> 
                            <td className='p-3 text-sm text-white/70'>
                                {formatBillingType(p.billingType)}
                            </td> 
                            <td className={`p-3 text-xs font-semibold uppercase ${statusColorMap[p.status] || 'text-white/50 bg-white/10'}`}>
                              {formatStatus(p.status)} 
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}