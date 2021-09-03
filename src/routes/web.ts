import express, { Application } from 'express';

import {
  getHomePage,
  saveEkadashis,
  sendEkadashis,
} from '../controllers/homeController';
import { jobController } from '../controllers/jobController';

const router = express.Router();

export const initAllWebRoutes = (app: Application): Application => {
  app.get('/', getHomePage);
  app.get('/ekadashis', sendEkadashis);
  app.post('/ekadashis', saveEkadashis);
  app.get('/runJob', jobController);
  return app.use('/', router);
};
