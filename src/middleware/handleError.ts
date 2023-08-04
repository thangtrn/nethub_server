import { Request, Response, NextFunction } from "express";
import {
  ErrorException,
  NotFoundException,
  reasonPhrases,
  statusCode,
} from "~/response";

export class handleError {
  public static NotFound = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    next(
      new NotFoundException(`[${req.method}] Not found resource: ${req.url}`)
    );
  };

  public static InternalServer = (
    err: ErrorException,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.group();
    console.log(
      "\n\n----------------------------------- LOGGER ERROR -------------------------------------"
    );
    console.warn("Status code: " + err.statusCode);
    console.warn("Time: " + new Date());
    console.warn(err.stack);
    console.log(
      "----------------------------------- LOGGER ERROR -------------------------------------"
    );
    console.groupEnd();

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      message: err.message || reasonPhrases.INTERNAL_SERVER_ERROR,
    });
  };
}
