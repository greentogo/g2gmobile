const ngrok = require('ngrok');
const http = require('http');
const fs = require('fs');

const greenToGoServerPort = 8000;
const envPath = `${__dirname}/.env`;

// http://127.0.0.1:4040/api/tunnels is cool
// TODO:
// curl --silent --show-error http://127.0.0.1:4040/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p'
// Then get it from process.env

async function removeFile() {
    try {
        return fs.unlinkSync(envPath);
    } catch (err) {
        return console.log(`File does not exist, skipping: ${envPath}`);
    }
}

function testConnection(url) {
    console.log('Testing GreenToGo Server connection, please wait...');
    return new Promise((resolve, reject) => {
        const hostname = url.match(/https?:\/\/(.*)/)[1];
        const options = {
            hostname,
            port: 80,
            path: '/',
            method: 'GET',
        };
        const req = http.request(options, (res) => {
            console.log(`statusCode from GreenToGo Server Test: ${res.statusCode}`);
            if (res.statusCode < 400) {
                resolve(res.status);
            } else {
                const error = new Error(`Status from ngrok: ${res.statusCode}\nGreenToGo Server most likely not started on port ${greenToGoServerPort}!`);
                reject(error);
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
        req.end();
    });
}

(async function init() {
    try {
        await removeFile();
        await ngrok.disconnect();
        const url = await ngrok.connect({
            proto: 'http', // http|tcp|tls, defaults to http
            addr: greenToGoServerPort, // port or network address, defaults to 80
            region: 'us', // one of ngrok regions (us, eu, au, ap), defaults to us
            configPath: `${__dirname}/ngrok.yml`,
            onStatusChange: (status) => {
                console.log(`Ngrok Status Change: ${status}`);
            }, // 'closed' - connection is lost, 'connected' - reconnected
            onLogEvent: (data) => {
                console.log(data);
            }, // returns stdout messages from ngrok process
        });
        await testConnection(url);
        await fs.writeFileSync(envPath, `NGROKHOST=${url}`);
        console.log(`Ngrok Ready at ${url}!\nStart expo by running 'npm start'`);
    } catch (error) {
        console.log('ERROR!');
        console.error(error);
        process.exit();
    }
}());

process.on('exit', () => {
    fs.unlink(envPath, () => console.log(`Deleted ${envPath}`));
});

process.on('SIGINT', () => {
    fs.unlink(envPath, () => console.log(`Deleted ${envPath}`));
});

process.on('SIGUSR1', () => {
    fs.unlink(envPath, () => console.log(`Deleted ${envPath}`));
});
process.on('SIGUSR2', () => {
    fs.unlink(envPath, () => console.log(`Deleted ${envPath}`));
});

process.on('uncaughtException', () => {
    fs.unlink(envPath, () => console.log(`Deleted ${envPath}`));
});
