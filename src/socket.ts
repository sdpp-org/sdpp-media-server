import fs, { read } from 'fs';
import path from 'path';
import socket from 'socket.io';

const CHUNK_SIZE = 1024 * 10 * 10;

const assetPath = path.resolve(process.cwd(), 'assets');
const filePath = path.resolve(assetPath, 'trojan.mp4');
const stat = fs.statSync(filePath);
const fileSize = stat.size;

export function configureSocket(server, app) {
  let count = 0;

  const io = socket(server);
  io.on('connection', (client) => {
    console.log('Connected socket', client.id);

    client.on('event', (data) => {
      console.log('event ', data);
    });

    client.on('disconnect', () => {
      console.log('socket disconnected');
    });

    const buffer = new Buffer(CHUNK_SIZE);

    fs.open(filePath, 'r', function(err, fd) {
      if (err) throw err;
      function readNextChunk() {
        fs.read(fd, buffer, 0, CHUNK_SIZE, null, function(err, nread) {
          if (err) throw err;

          if (nread === 0) {
            console.log('Done reading file');
            fs.close(fd, function(err) {
              if (err) throw err;
            });
            return;
          }

          var data;
          if (nread < CHUNK_SIZE)
            data = buffer.slice(0, nread);
          else
            data = buffer;

          console.log('Data chunk is read', count++);
          client.emit('video', data);
          readNextChunk();
        });
      }
      readNextChunk();
    });
  });
}
