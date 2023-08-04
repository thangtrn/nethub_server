import {Application, Router} from 'express';
import authRoute from './authRoute';
import postRoute from './postRoute';
import userRoute from './userRoute';

const rootRoutes = (app: Application) => {
   const routes: Router[] = [authRoute, postRoute, userRoute];

   app.use('/api', routes);
};

export default rootRoutes;
