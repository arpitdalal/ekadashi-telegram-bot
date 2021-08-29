import express, { Application } from 'express';

import {
  getHomePage,
  saveEkadashis,
  sendEkadashis,
} from '../controllers/homeController';

const router = express.Router();

export const initAllWebRoutes = (app: Application): Application => {
  app.get('/', getHomePage);
  app.get('/ekadashis', sendEkadashis);
  app.post('/ekadashis', saveEkadashis);
  return app.use('/', router);
};
