import axios from 'axios';
import { NGROKHOST } from 'react-native-dotenv';

const prodHost = 'https://app.durhamgreentogo.com';
// const url = 'https://g2g.dreisbach.us'; // Staging
// const url = 'https://c1ad61be.ngrok.io'; // Testing

function getNgrokUrl() {
    return NGROKHOST || prodHost;
}

const host = __DEV__ ? getNgrokUrl() : prodHost;

const instance = axios.create({
    baseURL: `${host}/api/v1`,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;
