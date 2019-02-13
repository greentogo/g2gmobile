import axios from 'axios';

const url = 'https://app.durhamgreentogo.com/api/v1'; // Production
// const url = 'https://g2g.dreisbach.us/api/v1'; // Staging
// const url = 'https://875fa750.ngrok.io/api/v1'; // Testing
// TODO:
// curl --silent --show-error http://127.0.0.1:4040/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p'
// Then get it from process.env

const instance = axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {
        Accept: 'application/json',
    },
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;
