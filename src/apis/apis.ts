import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const assetPath = path.resolve(process.cwd(), 'assets');

export function video(req, res, next) {
  const { range } = req.headers;
  console.log('/video with range: ', range);

  const filePath = path.resolve(assetPath, 'trojan.mp4');
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  let count = 0;

  if (range) {
    const parts = range.replace(/bytes=/, "")
      .split("-");
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;

    const chunksize = (end - start) + 1;
    const readStream = fs.createReadStream(filePath, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    readStream.pipe(res);
  } else {
    console.log('Range not there');

    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    fs.createReadStream(filePath)
      .pipe(res);
  }
}
