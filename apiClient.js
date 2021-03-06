import axios from 'axios';
// import { NGROKHOST } from 'react-native-dotenv';

const prodHost = 'https://app.durhamgreentogo.com';
// const url = 'https://g2g.dreisbach.us'; // Staging
// const url = 'https://c1ad61be.ngrok.io'; // Testing

// const host = __DEV__ ? NGROKHOST || prodHost : prodHost;
const host = prodHost;

const instance = axios.create({
    baseURL: `${host}/api/v1`,
    timeout: 5000,
    headers: {
        Accept: 'application/json',
    },
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.log = (context, error) => {
    instance.post('/log/', {
        context, message: error.message, stack: error.stack, error,
    });
};

export default instance;
