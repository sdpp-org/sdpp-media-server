import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { video } from '@@apis/apis';

const port: number = 4001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(htmlLogger);
app.use(cors());

app.use('/video', video);

app.listen(4001, () => {
  console.log('App is listening %s', port);
});

function htmlLogger(req, res, next) {
  console.log('%s %s %s', new Date(), req.url, req.method, req.body);
  next();
}
