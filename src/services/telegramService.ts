import request from 'request';
import { config } from 'dotenv';

import { Ekadashi } from '../typings/ekadashis';

config();

export const sendNotification = (ekadashi: Ekadashi): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const data = {
        chat_id: process.env.TELEGRAM_GROUP_ID,
        parse_mode: 'HTML',
        text: `📅 <strong>Reminder</strong>\nToday - <strong>${ekadashi.date}</strong> is <strong><i>${ekadashi.title}</i></strong> 🍇🍎🥗`,
      };

      request(
        {
          uri: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          method: 'POST',
          json: data,
        },
        (err) => {
          if (!err) {
            resolve('done!');
          } else {
            console.log(err);
            reject(err);
          }
        },
      );
    } catch (err) {
      reject(err);
    }
  });
};
