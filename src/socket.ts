import fs, { read } from 'fs';
import path from 'path';
import socket from 'socket.io';

const CHUNK_SIZE = 1024 * 10 * 2000;

const assetPath = path.resolve(process.cwd(), 'assets');
const filePath = path.resolve(assetPath, 'trojan2.webm');
const stat = fs.statSync(filePath);
const fileSize = stat.size;

export function configureSocket(server, app) {
  const io = socket(server);
  io.on('connection', (client) => { 
    client.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });

  app.get('/video', (req, res, next) => {
    sendFileChunk(io.sockets);

    res.send({
      a: 1,
    });
  });
}

function sendFileChunk(client) {
  let count = 0;
  const buffer = Buffer.alloc(CHUNK_SIZE);

  fs.open(filePath, 'r', function(err, fd) {
    if (err) {
      throw err;
    }

    function readNextChunk() {
      fs.read(fd, buffer, 0, CHUNK_SIZE, null, function(err, nread) {
        if (err) {
          throw err;
        }

        if (nread === 0) {
          console.log('Done reading file');
          fs.close(fd, function(err) {
            if (err) {
              throw err;
            }
          });
          return;
        }

        let data;
        if (nread < CHUNK_SIZE) {
          data = buffer.slice(0, nread);
          client.emit('video', data, 1);
        } else {
          data = buffer;
          client.emit('video', data);
        }

        console.log('Data chunk is read', count++);
        readNextChunk();
      });
    }
    readNextChunk();
  });
}
