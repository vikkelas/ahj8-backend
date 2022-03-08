const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const WebSocket = require('ws');
const {
   uuid
} = require('uuidv4');
const cors = require('@koa/cors');
const {
   cli
} = require('forever');
const app = new Koa();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(koaBody({
   urlencoded: true,
   multipart: true,
   json: true,
}));


const clients = [];
let indexIcon = 9;

const server = http.createServer(app.callback());

const wsServer = new WebSocket.Server({
   server
});
wsServer.on('connection', (ws) => {
   const id = uuid();
   const client = {};
   client.id = id;
   indexIcon -= 1;
   if (indexIcon === -1) {
      indexIcon = 9;
   }
   client.idIcon = indexIcon;
   ws.on('message', (msg) => {
      const data = JSON.parse(msg);
      if (data.type === 'add') {
         const nameIndex = clients.findIndex(item => item.name === data.name);
         if (nameIndex !== -1) {
            ws.send(JSON.stringify({
               type: 'err name use'
            }));
         }
         if (nameIndex === -1) {
            client.name = data.name;
            clients.push(client);
            ws.send(JSON.stringify({
               type: 'create account',
               id: client.id,
            }));
            wsServer.clients.forEach(item => {
               item.send(JSON.stringify({
                  type: "new conection",
                  data: clients,
                  newClient: client.name,
               }));
            });
         }
      }
      if (data.type === 'new message') {
         const indClient = clients.findIndex(item => item.id === data.id);
         data.name = clients[indClient].name;
         wsServer.clients.forEach(item => item.send(JSON.stringify(data)));
      }
   });

   ws.on('close', () => {
      const indexArr = clients.findIndex(item => item.id === client.id);
      clients.splice(indexArr, 1);
      if (client.name !== null) {
         wsServer.clients.forEach(item => item.send(JSON.stringify({
            type: 'user disconected',
            name: client.name,
            data: clients,
         })));
      }
   });
});

server.listen(port);