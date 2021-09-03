import express, { Application } from 'express';
import path from 'path';

export const configViewEngine = (app: Application): void => {
  app.use(express.static(path.join(__dirname, '../public')));
};
