const Joi = require('joi').extend(require('@joi/date'));
import {Schema} from 'joi';
import {Gender} from '~/enum';

export const registerSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().email().required(),
   password: Joi.string().min(6).required(),
   gender: Joi.string().valid(Gender.MALE, Gender.FEMALE),
   birthday: Joi.date().required().format('YYYY-MM-DD').utc(),
});

export const loginSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().required(),
});

export const postSchema = Joi.object({
   userId: Joi.number().required(),
   content: Joi.string().required(),
   isGlobal: Joi.boolean().default(true),
});

export const likeSchema = Joi.object({
   userId: Joi.number().required(),
   postId: Joi.number().required(),
});

export const postQuerySchema = Joi.object({
   page: Joi.number().integer().default(1),
   limit: Joi.number().integer().default(20),
});

export const commentSchema = Joi.object({
   userId: Joi.number().integer().required(),
   postId: Joi.number().required(),
   content: Joi.string().required(),
});

export const replySchema = Joi.object({
   userId: Joi.number().integer().required(),
   postId: Joi.number().required(),
   parentId: Joi.number().required(),
   content: Joi.string().required(),
});

export const followSchemal = Joi.object({
   userId: Joi.number().integer().required(),
   followerId: Joi.number()
      .integer()
      .required()
      .custom((value: any, helpers: any) => {
         const {userId, followerId} = helpers.state.ancestors[0];
         if (value === userId) {
            throw new Error('userId must be different from followerId');
         }

         return value;
      }),
});

const validator = (obj: any, schemal: Schema): {value: any; errors: string[]} => {
   const {value, error}: any = schemal.validate(obj, {
      abortEarly: false,
   });
   let errors;
   if (error) {
      errors = error.details.map((detail: any) => detail.message);
   }

   return {value, errors};
};

export default validator;
