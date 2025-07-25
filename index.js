const app = require('./app');
const http = require('http');

const server = http.createServer(app);

const PORT = 3000;

server.listen(PORT, () => {
    console.log('Server is running on port 3000');
});