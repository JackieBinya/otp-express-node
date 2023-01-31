import express from 'express';
import apiRoutes from './routes/index.js'

const app = express();

app.use(apiRoutes);

app.get('/', (req, res) => {
  res.send("OTP server is running");
});

export { app };
