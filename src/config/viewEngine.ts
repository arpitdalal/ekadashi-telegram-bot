import express, { Application } from 'express';
import path from 'path';

export const configViewEngine = (app: Application): void => {
  app.use(express.static(path.join(__dirname, '../public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
};
