import axios from 'axios';

const BACKEND_URL = 'https://backend.atende.eco.br';

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

export default axios;