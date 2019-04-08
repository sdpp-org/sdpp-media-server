import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';

import { configureSocket } from './socket';
import { handshake, pay, paySucceed } from '@@apis/iota';

const port: number = 4001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(htmlLogger);
app.use(cors());

app.post('/apis/handshake', handshake);
app.post('/apis/pay', pay);
app.post('/apis/pay-succeed', paySucceed);

const server = http.createServer(app);
configureSocket(server, app);

server.listen(4001, () => {
  console.log('App is listening %s', port);
});

function htmlLogger(req, res, next) {
  console.log('%s %s %s', new Date(), req.url, req.method, req.body);
  next();
}
