import express from 'express';
import { StatusCodes } from 'http-status-codes';

import connectDB from "./config/db.config.js";
import { PORT } from './config/server.config.js';

const app = express();
app.use(express.json());

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await connectDB();
});
