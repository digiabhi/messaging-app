import express from 'express';
import { StatusCodes } from 'http-status-codes';

import connectDB from "./config/db.config.js";
import { PORT } from './config/server.config.js';
import apiRouter from './routes/v1/api.route.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter)
app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await connectDB();
});
