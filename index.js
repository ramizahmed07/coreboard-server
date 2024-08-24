// Main starting point of the application
const dotenv = require('dotenv');

const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const { Server } = require('http');

dotenv.config();

const db = require('./src/database');
const schemas = require('./src/database/schemas');
const routes = require('./src/routes');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const port = process.env.PORT;

const host = process.env.HOST || '0.0.0.0';

const app = express();
const server = Server(app);

const startServer = async () => {
  try {
    // database connections with sharedb
    await db.connect();
    // wait for database connections to be created / loaded
    await Promise.allSettled(
      Array.from(Object.values(schemas)).map((fn) => fn())
    );

    // set cors with options
    const corsOptions = {
      origin(origin, callback) {
        callback(null, true);
      },
      allowedHeaders: ['Content-Type', 'x-authorization'],
      exposedHeaders: ['x-authorization'],
      credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(express.json());

    // express routes
    app.use('/api', routes);

    // expose static files
    // app.use(express.static(path.join(__dirname, 'build')));
    // app.get('*', (req, res) => {
    //   res.sendFile(path.join(__dirname, 'build', 'index.html'));
    // });

    // server listen
    server.listen(port, host, () => console.log(`Listening on port ${port}`));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

startServer();
