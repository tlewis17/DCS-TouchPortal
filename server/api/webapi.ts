import express from 'express';

export class WebApi {
  // Web Server - TODO, show current status and states
  constructor() {
    const app = express();
    const PORT = 8000;
    const appFolder = 'webui';

    const bodyParser = require('body-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    const compression = require('compression');
    app.use(compression()); // Compress all routes

    app.get('/api', (req, res) => res.send('Express + TypeScript Server - DCS'));

    // ---- SERVE STATIC FILES ---- //
    app.get('*.*', express.static(appFolder, { maxAge: '1y' }));

    // ---- SERVE APLICATION PATHS ---- //
    app.all('*', (req, res) => {
      res.status(200).sendFile(`/`, { root: appFolder });
    });

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
  }
}
