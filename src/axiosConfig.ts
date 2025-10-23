import axios from 'axios';

const BACKEND_URL = 'https://backendsite.atende.eco.br';

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

// 2. Função para configurar o token de autenticação
export const setAuthToken = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer $aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRlMDY2NDY1LThjMjktNGVjOS1hMGQyLTVkNmUzNGVmYmYzZDo6JGFhY2hfZGFjMjk0MzgtZDc1MS00NDgwLTgwOGMtZDBjNThhN2NiMTA0`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default axios;