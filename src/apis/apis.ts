import { Request, Response, NextFunction } from 'express';

export function video(req, res, next) {
  console.log(123, req.body);

  res.send('1') 
}
