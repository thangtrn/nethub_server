import {Gender} from '~/enum';

export interface ILogin {
   email: string;
   password: string;
}

export interface IRegister extends ILogin {
   name: string;
   gender: Gender;
   birthday: Date;
}

export interface IPayloadToken {
   userId: number;
   role: string;
   roleId: number;
   [key: string]: any;
}
