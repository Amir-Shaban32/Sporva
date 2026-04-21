import { Request, Response, NextFunction, RequestHandler } from "express";
import { BadRequestError } from "../errors/app-error";
import { z, ZodType } from "zod";

type requestTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodType, target: requestTarget = "body"): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      return next(new BadRequestError("Validation failed", fieldErrors));
    }

    Object.assign(req[target], result.data);
    return next();
  };
