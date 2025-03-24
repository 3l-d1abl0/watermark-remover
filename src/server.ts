import  http from 'http';
import app from './app.js';
import { config } from './config/config.js';

const port = config.port || 3000;


//Srart the Server
const server = http.createServer(app); //pass in a listner

server.on('listening', function () {
    console.log(`Server is Running on ${port}!`);
}).on('error', function (err) {
    console.log('Server Error : ', err);
}).on('end', function(err){
    console.log('Shutting down Server : ', err);
});


server.listen(port);
server.timeout = 10000;



