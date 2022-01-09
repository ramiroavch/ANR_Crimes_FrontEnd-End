import axios from 'axios';
import {store} from "./store";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

instance.interceptors.request.use((config) => {
    const token = store.getState().user.accessToken;
    config.headers.Authorization = token ? `Bearer ${token}` : undefined

    return config
})

instance.defaults.headers.common['Content-Type'] = 'application/json';

export default instance;