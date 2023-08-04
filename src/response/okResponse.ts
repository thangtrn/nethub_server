import {Response} from 'express';
import statusCode from './statusCode';
import {IPage} from '~/interface';

export default class OkResponse {
   res: Response;
   status: statusCode;
   message: string;
   data?: any;
   accessToken?: string | null;
   pagination?: IPage;
   constructor(
      res: Response,
      message: string,
      data?: any,
      accessToken?: string | null,
      pagination?: IPage
   ) {
      this.res = res;
      this.message = message;
      this.data = data;
      this.accessToken = accessToken;
      this.pagination = pagination;
      this.send();
   }

   send() {
      this.res.status(this.status || statusCode.OK).json(
         this.removeEmpty({
            statusCode: statusCode.OK,
            message: this.message || 'Successfully.',
            data: this.data || null,
            accessToken: this.accessToken,
            pagination: this.pagination,
         })
      );
   }

   removeEmpty = (obj: any): any => {
      return Object.keys(obj)
         .filter((key) => {
            // if (obj[key] === Object(obj[key])) {
            //    return this.removeEmpty(obj[key]);
            // } else
            if (obj[key] !== undefined && obj[key] !== null) {
               return key;
            }
         })
         .reduce((prev, cur) => {
            return {
               ...prev,
               [cur]: obj[cur],
            };
         }, {});
   };
}
