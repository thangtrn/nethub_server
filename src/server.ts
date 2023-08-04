import 'reflect-metadata';
import 'express-async-errors';
import express, {Application} from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';

import dataSource from '~/config/data-source';
import rootRoutes from '~/routes';
import {handleError} from '~/middleware/handleError';
import {IPayloadToken} from './interface';

// variable
config();
const PORT = process.env.PORT || 5000;
const app: Application = express();

declare global {
   namespace Express {
      interface Request {
         jwt: IPayloadToken;
      }
   }
}

// use middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
rootRoutes(app);

// handle error
app.use(handleError.NotFound);
app.use(handleError.InternalServer);

// start server
const main = () => {
   const server = app.listen(5000, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
   });

   process.on('SIGINT', () => {
      server.close(() => console.log('Exits servers.'));
   });
};

// connection database
dataSource
   .initialize()
   .then(() => {
      main();
      console.log('⚡️[database]: Database connection successful.');
   })
   .catch((error) => {
      console.log('⚡️[database]: Database connection failed. ', error);
   });
