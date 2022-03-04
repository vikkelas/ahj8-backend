const http = require('http');
const WS = require('ws');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
const {
   uuid
} = require('uuidv4');
const app = new Koa();
app.use(cors());
const port = process.env.PORT || 8080;
const wsServer = new WS({
   server
});

const client = [];
const messages = [];

app.use(koaBody({
   urlencoded: true,
   multipart: true,
   json: true,
}));

router.get('/chat', async (ctx, next) => {

});




app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback()).listen(port);