import statusCode from './statusCode';
import reasonPhrases from './reasonPhrases';

export class ErrorException extends Error {
   statusCode: statusCode;

   constructor(statusCode: statusCode, message: string | string[]) {
      if (typeof message === 'string') {
         super(message);
      } else {
         super((message as string[]).join(', '));
      }
      this.statusCode = statusCode;
   }
}

export class NotFoundException extends ErrorException {
   constructor(message: string | string[] = reasonPhrases.NOT_FOUND) {
      super(statusCode.NOT_FOUND, message);
   }
}

export class UnprocessableException extends ErrorException {
   constructor(message: string | string[] = reasonPhrases.UNPROCESSABLE_ENTITY) {
      super(statusCode.UNPROCESSABLE_ENTITY, message);
   }
}

export class ConflictException extends ErrorException {
   constructor(message: string | string[] = reasonPhrases.CONFLICT) {
      super(statusCode.CONFLICT, message);
   }
}

export class UnauthorizedException extends ErrorException {
   constructor(message: string | string[] = reasonPhrases.UNAUTHORIZED) {
      super(statusCode.UNAUTHORIZED, message);
   }
}

export class ForbiddenException extends ErrorException {
   constructor(message: string | string[] = reasonPhrases.FORBIDDEN) {
      super(statusCode.FORBIDDEN, message);
   }
}
