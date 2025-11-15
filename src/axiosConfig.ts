import axios from 'axios';

const BACKEND_URL = 'https://backendsite.atende.eco.br';

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

export default axios;