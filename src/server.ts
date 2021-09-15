import { config } from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { configViewEngine } from './config/viewEngine';
import { initAllWebRoutes } from './routes/web';

// BOOTSTRAP
config();
const app = express();
const port = process.env.PORT || 5000;
try {
  if (!fs.existsSync(path.join(__dirname, '../ekadashis.json'))) {
    const defaultEkadashis = [{}];
    const defaultEkadashisBuffer = JSON.stringify(defaultEkadashis, null, 2);
    fs.writeFile(
      path.join(__dirname, '../ekadashis.json'),
      defaultEkadashisBuffer,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('ekadashis.json created');
        }
      },
    );
  }
} catch (err) {
  console.log(err);
}

// CONFIGURE THE BODY PARSING SO DATA CAN BE READ BY THE SERVER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIGURE THE VIEW ENGINE TO EJS
configViewEngine(app);

// INITIALIZE THE WEB ROUTES
initAllWebRoutes(app);

// SERVER LISTEN ON THE GIVEN PORT
app.listen(port, () => console.log(`Server listening on ${port}`));
