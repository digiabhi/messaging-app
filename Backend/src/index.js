import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import serverAdapter from './config/bullboard.config.js';
import connectDB from './config/db.config.js';
import { PORT } from './config/server.config.js';
import channelHandlers from './controllers/channelSocket.controller.js';
import messageHandlers from './controllers/messageSocket.controller.js';
import apiRouter from './routes/v1/api.route.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/ui', serverAdapter.getRouter());
app.use('/api', apiRouter);
app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

io.on('connection', (socket) => {
  messageHandlers(io, socket);
  channelHandlers(io, socket);
});

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
