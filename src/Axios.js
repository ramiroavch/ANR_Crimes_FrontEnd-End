import Axios from 'axios';

const instance = Axios.create({
    baseURL:process.env.BASE_URL_BACK
})



Axios.defaults.headers.common['Content-Type'] = 'application/json';

export default instance;