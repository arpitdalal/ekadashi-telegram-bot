import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import { Ekadashi } from '../typings/ekadashis';

// HANDLE _GET_ "/" ROUTE
export const getHomePage = (_: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../public/'));
};

// HANDLE _GET_ "/EKADASHIS" ROUTE
export const sendEkadashis = (_: Request, res: Response): void => {
  const ekadashisRawData = fs.readFileSync(
    path.join(__dirname, '../../ekadashis.json'),
  );
  const ekadashisStringData = ekadashisRawData.toString();
  const ekadashis: Ekadashi[] | [] = JSON.parse(ekadashisStringData);
  res.send(ekadashis);
};

// HANDLE _POST_ "/EKADASHIS" ROUTE
export const saveEkadashis = (req: Request, res: Response): void => {
  const body = req.body;
  const ekadashis = JSON.stringify(body, null, 2);
  fs.writeFile(
    path.join(__dirname, '../../ekadashis.json'),
    ekadashis,
    (err) => {
      if (err) {
        res.send({
          ok: 'false',
          message: err,
        });
      } else {
        res.send({
          ok: 'true',
        });
      }
    },
  );
};
