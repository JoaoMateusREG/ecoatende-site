import { useState, useEffect } from "react";
import {
  User,
  ClipboardList,
  DollarSign,
  Calendar,
  X,
  LogOut,
  ExternalLink,
  Pen,
  Check,
} from "lucide-react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

interface OrganizationEntity {
  cnpj: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  creationDate?: string;
}

interface Subscription {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  nextDueDate: string;
  cycle: string;
  billingType: string;
  status: string;
  organizationCnpj: string;
}

interface Payment {
  id: string;
  dateCreated: string;
  customer: string;
  organizationCnpj: string;
  subscriptionId: string;
  dueDate: string;
  originalDueDate: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  originalValue: number | null;
  invoiceUrl: string;
  transactionReceiptUrl: string;
}

interface SubscriptionData extends OrganizationEntity {
  subscription: Subscription[];
  payments: Payment[];
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const parts = dateString.includes("/") ? dateString.split("/") : [];
  const date =
    parts.length === 3
      ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      : new Date(dateString);

  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("pt-BR");
};

const formatCurrency = (amount: number) => {
  if (typeof amount !== "number") return "R$ 0,00";
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatBillingType = (type: string | null | undefined) => {
  if (!type) return "Não Definido";

  switch (type) {
    case "BOLETO":
      return "Boleto";
    case "CREDIT_CARD":
      return "Cartão de Crédito";
    case "PIX":
      return "Pix";
    case "UNDEFINED":
      return "Não Definido";
    default:
      const formatted = type.toLowerCase().replace(/_/g, " ");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Ativa";
    case "PENDING":
      return "Pendente";
    case "CANCELED":
      return "Cancelada";
    case "INACTIVE":
      return "Inativa";
    case "PAID":
    case "RECEIVED":
    case "CONFIRMED":
      return "Pago";
    case "FAILED":
      return "Falhado";
    case "REFUNDED":
      return "Estornado";
    default:
      return status;
  }
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<OrganizationEntity | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const customer = user?.organization?.customerId;

      const response = await axios.post("/subscriptions/gateway", {
        customer: customer,
      });

      // Atualiza os dados após criar a assinatura
      if (response.status === 200 || response.status === 201) {
        // Recarrega os dados
        window.location.reload();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erro ao criar assinatura";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setSubscribing(false);
      setShowModal(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!subscription) return;

    setUpdatingStatus(true);
    try {
      const newStatus =
        subscription.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await axios.put(`/subscriptions/${subscription.id}`, {
        status: newStatus,
        subscriptionId: subscription.id,
      });

      // Recarrega os dados após atualizar
      window.location.reload();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erro ao atualizar status";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setUpdatingStatus(false);
      setShowEditModal(false);
    }
  };

  const statusColorMap: { [key: string]: string } = {
    ACTIVE: "text-green-400 bg-green-500/20",
    PENDING: "text-yellow-400 bg-yellow-500/20",
    CANCELED: "text-red-400 bg-red-500/20",
    INACTIVE: "text-gray-400 bg-gray-500/20",
    PAID: "text-green-400 bg-green-500/20",
    RECEIVED: "text-green-400 bg-green-500/20",
    CONFIRMED: "text-green-400 bg-green-500/20",
    FAILED: "text-red-400 bg-red-500/20",
    REFUNDED: "text-yellow-400 bg-yellow-500/20",
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        if (!user?.organization?.cnpj) {
          throw new Error("CNPJ da organização não encontrado");
        }

        const backendUrl = `/organizations/${user.organization.cnpj}`;
        const response = await axios.get<SubscriptionData>(backendUrl);

        const data = response.data;

        if (!isMounted) return;

        // Define os dados da organização
        setUserData({
          cnpj: data.cnpj,
          name: data.name,
          email: data.email || "Não informado",
          phone: data.phone || "Não informado",
          creationDate: data.creationDate,
        });

        // Define a assinatura se existir
        if (data.subscription && data.subscription.length > 0) {
          setSubscription(data.subscription[0]);
        } else {
          setSubscription(null);
        }

        // Define os pagamentos se existirem
        setPayments(data.payments || []);
      } catch (err: any) {
        if (!isMounted) return;

        const detailedError =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Erro desconhecido";

        const statusMessage =
          err.response?.status === 400
            ? "Erro ao validar CNPJ"
            : "Falha ao carregar dados";

        setError(`${statusMessage}: ${detailedError}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <h2 className="text-xl text-white/70">Carregando dados...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-8">
        <X size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Erro de Conexão
        </h2>
        <p className="text-white/70 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-14 pb-12 px-4 md:px-8">
      <div className="px-6 mx-auto">
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4 mb-8 md:mb-12">
          <h1 className="text-4xl font-bold">
            {user?.organization?.name || "Conta"}
          </h1>
          <div className="flex gap-4 justify-end md:justify-start">
            {!subscription && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <Pen size={20} />
                Assinar
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg h-min">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
              <User size={24} className="text-blue-400" />
              <h2 className="text-xl font-semibold">
                Dados do estabelecimento
              </h2>
            </div>

            <div className="space-y-4 text-sm md:text-base">
              <div>
                <p className="text-white/70">Nome</p>
                <p className="font-medium text-lg">{userData?.name}</p>
              </div>

              <div>
                <p className="text-white/70">CNPJ</p>
                <p className="font-medium">{userData?.cnpj}</p>
              </div>

              <div>
                <p className="text-white/70">Email</p>
                <p className="font-medium">{userData?.email}</p>
              </div>

              <div>
                <p className="text-white/70">Telefone</p>
                <p className="font-medium">{userData?.phone}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-blue-500/30 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <ClipboardList size={24} className="text-purple-400" />
                  <h2 className="text-xl font-semibold">
                    Detalhes da Assinatura
                  </h2>
                </div>
                <div className="flex items-center gap-2 scrollbar">
                  {subscription && (
                    <>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        <Pen size={16} />
                        Gerenciar
                      </button>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          statusColorMap[subscription.status]
                        }`}
                      >
                        {formatStatus(subscription.status)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {subscription ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
                  <div>
                    <p className="text-white/70">Método de pagamento</p>
                    <p className="text-lg font-bold text-blue-400">
                      {formatBillingType(subscription.billingType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/70">Valor Mensal</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(subscription.value)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-white/70">Próxima Renovação</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-400" />
                        <p className="font-medium">
                          {formatDate(subscription.nextDueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-white/50 text-center">
                  Nenhuma assinatura encontrada.
                </p>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                <DollarSign size={24} className="text-green-400" />
                <h2 className="text-xl font-semibold">
                  Histórico de Pagamentos
                </h2>
              </div>

              <div className="overflow-x-auto max-h-96 scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm uppercase text-white/50">
                      <th className="p-3 font-medium">ID da Transação</th>
                      <th className="p-3 font-medium">Data</th>
                      <th className="p-3 font-medium">Valor</th>
                      <th className="p-3 font-medium">Método</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Comprovante</th>
                      <th className="p-3 font-medium">Checkout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-3 text-center text-white/50"
                        >
                          Nenhum pagamento encontrado.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr
                          key={p.id}
                          className="border-t border-white/5 hover:bg-white/10 transition-colors"
                        >
                          <td className="p-3 text-sm font-mono">{p.id}</td>
                          <td className="p-3 text-sm">
                            {formatDate(p.dueDate)}
                          </td>
                          <td className="p-3 text-sm font-semibold">
                            {formatCurrency(p.value)}
                          </td>
                          <td className="p-3 text-sm text-white/70">
                            {formatBillingType(p.billingType)}
                          </td>
                          <td
                            className={`p-3 text-xs font-semibold uppercase ${
                              statusColorMap[p.status] ||
                              "text-white/50 bg-white/10"
                            }`}
                          >
                            {formatStatus(p.status)}
                          </td>
                          <td className="p-3 text-sm">
                            {p.transactionReceiptUrl ? (
                              <a
                                href={p.transactionReceiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-all text-xs font-medium backdrop-blur-sm shadow-sm"
                              >
                                <ExternalLink
                                  size={14}
                                  className="text-blue-300"
                                />
                                <span>Comprovante</span>
                              </a>
                            ) : (
                              <span className="text-white/40 text-xs italic">
                                Comprovante
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-sm">
                            {p.invoiceUrl && !p.transactionReceiptUrl ? (
                              <a
                                href={p.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-all text-xs font-medium backdrop-blur-sm shadow-sm"
                              >
                                <ExternalLink
                                  size={14}
                                  className="text-blue-300"
                                />
                                <span>Checkout</span>
                              </a>
                            ) : (
                              <span className="text-white/40 text-xs italic">
                                Checkout
                              </span>
                            )}
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

      {/* Modal de Assinatura */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Confirmar Assinatura
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">Cliente</p>
                <p className="text-white font-mono text-sm">
                  {user?.organization?.name}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">CNPJ</p>
                <p className="text-white font-mono text-sm">
                  {user?.organization?.cnpj}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">Ciclo de pagamento</p>
                <p className="text-white font-mono text-sm">MENSAL</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">
                  Métodos de pagamento
                </p>
                <p className="text-white font-mono text-sm">
                  Boleto, PIX e Cartão de Crédito
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">Primeiro pagamento</p>
                <p className="text-white font-mono text-sm">Hoje</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">
                  Valor da assinatura
                </p>
                <p className="text-white font-mono text-sm">R$ 99,00</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Status */}
      {showEditModal && subscription && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Gerenciar Assinatura
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">ID da Assinatura</p>
                <p className="text-white font-mono text-sm">
                  {subscription.id}
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">Status Atual</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    statusColorMap[subscription.status]
                  }`}
                >
                  {formatStatus(subscription.status)}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 mb-2">Novo Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    subscription.status === "ACTIVE"
                      ? statusColorMap["INACTIVE"]
                      : statusColorMap["ACTIVE"]
                  }`}
                >
                  {subscription.status === "ACTIVE" ? "Inativa" : "Ativa"}
                </span>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  {subscription.status === "ACTIVE"
                    ? "⚠️ Ao desativar, a assinatura será suspensa e não gerará novas cobranças."
                    : "✓ Ao ativar, a assinatura voltará a gerar cobranças normalmente."}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  subscription.status === "ACTIVE"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {updatingStatus ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    {subscription.status === "ACTIVE" ? "Desativar" : "Ativar"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
