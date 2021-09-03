import moment from 'moment';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

import { sendNotification } from '../services/telegramService';
import { Ekadashi } from '../typings/ekadashis';

const transporter = nodemailer.createTransport(
  `smtps://${process.env.NODEMAILER_USER}:${process.env.NODEMAILER_PASSWORD}@${process.env.NODEMAILER_HOST}`,
);

export const jobController = (_: Request, res: Response): void => {
  console.log('---------------------');
  console.log('Running Job');

  const todaysDate = new Date();
  const todaysFormattedDate = moment(todaysDate).format('MMMM D, YYYY');

  const ekadashisRawData = fs.readFileSync(
    path.join(__dirname, '../ekadashis.json'),
  );
  const ekadashis: [Ekadashi] = JSON.parse(
    ekadashisRawData as unknown as string,
  );

  ekadashis.forEach((ekadashi) => {
    if (todaysFormattedDate == ekadashi.date) {
      sendNotification(ekadashi)
        .then(() => {
          console.log('Notification sent');

          res.send({
            ok: 'true',
          });
        })
        .catch((err) => {
          // SEND AN EMAIL ABOUT THE ERROR TO ARPITDALALM@GMAIL.COM
          const messageOptions = {
            from: 'arpitdalalm@gmail.com',
            to: 'arpitdalalm@gmail.com',
            subject: 'ERROR MESSAGE FROM EKADASHI REMINDER BOT',
            text: `Couldn't send the the notification to the channel! ERROR: ${err}!`,
          };
          transporter.sendMail(messageOptions, (error) => {
            if (error) {
              console.log(error);
            }
          });

          res.send({
            ok: 'false',
            message: err,
          });
        });
    }
  });
};
