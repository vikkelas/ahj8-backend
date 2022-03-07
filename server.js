const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const router = new Router();
const WebSocket = require('ws');
const {
   uuid
} = require('uuidv4');
const cors = require('@koa/cors');
const app = new Koa();
const port = process.env.PORT || 8080;

const userState = [];


app.use(cors());
app.use(koaBody({
   urlencoded: true,
   multipart: true,
   json: true,
}));

router.post('/newuser', async (ctx) => {
   const id = uuid();
   const {
      name
   } = ctx.request.body;
   const index = userState.findIndex(item => item.name === name);
   let iconUser = Math.floor(Math.random() * 11);
   const indexIconUser = userState.findIndex(item => item.idIcon === iconUser);
   if (userState !== 0 && indexIconUser === -1) {
      if (index !== -1) {
         ctx.response.body = [];
         console.log(userState);
      }
      if (index === -1) {
         userState.push({
            name: name,
            id: id,
            idIcon: iconUser,
         });
         ctx.response.body = userState;
         console.log(userState);
      }
   } else {
      iconUser = Math.floor(Math.random() * 11);
   }
});

app.use(router.routes());
app.use(router.allowedMethods());
const server = http.createServer(app.callback());

router.get('/websocket', ctx => {
   const wsServer = new WebSocket.Server({
      server
   });
   wsServer.on('connection', ws => {
      if (ws.readyState === WebSocket.OPEN) {
         console.log('conected');
         ws.on('message', msg => {
            console.log('adasdsad ssdaf dsf ');
         });
      }
   });

   ctx.respond = false;
});
server.listen(port);