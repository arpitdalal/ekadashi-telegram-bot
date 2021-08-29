import { config } from 'dotenv';
import express from 'express';

import { cronJob } from './services/cronJob';
import { configViewEngine } from './config/viewEngine';
import { initAllWebRoutes } from './routes/web';

// BOOTSTRAP
config();
const app = express();
const port = process.env.PORT || 5000;

// CONFIGURE THE BODY PARSING SO DATA CAN BE READ BY THE SERVER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIGURE THE VIEW ENGINE TO EJS
configViewEngine(app);

// INITIALIZE THE WEB ROUTES
initAllWebRoutes(app);

// RUN THE CRON JOB
cronJob();

// SERVER LISTEN ON THE GIVEN PORT
app.listen(port);