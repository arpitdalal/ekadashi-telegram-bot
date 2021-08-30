import moment from 'moment';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

import { sendNotification } from './telegramService';
import { Ekadashi } from '../typings/ekadashis';

const transporter = nodemailer.createTransport(
  `smtps://${process.env.NODEMAILER_USER}:${process.env.NODEMAILER_PASSWORD}@${process.env.NODEMAILER_HOST}`,
);

export const cronJob = (): void => {
  // RUNS AT 12:00 AM EVERY DAY
  cron.schedule('0 0 * * *', (): void => {
    console.log('---------------------');
    console.log('Running Cron Job');

    const todaysDate = new Date();
    const todaysFormattedDate = moment(todaysDate).format('MMMM DD, YYYY');

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
          });
      }
    });
  });
};
