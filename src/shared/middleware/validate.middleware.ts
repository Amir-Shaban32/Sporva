import { Request, Response, NextFunction, RequestHandler } from "express";
import { BadRequestError } from "@shared/errors/app-error";
import { z, ZodType } from "zod";

type requestTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodType, target: requestTarget = "body"): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const flatError = z.flattenError(result.error); // field errors + root errors
      const fieldErrors = flatError.fieldErrors as Record<string, string[]>;
      const formErrors = flatError.formErrors as string[];
      const errors: Record<string, string[]> = {};

      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          errors[key] = messages;
        }
      }

      if (formErrors.length > 0) errors["_root"] = formErrors;

      return next(new BadRequestError("Validation failed", errors));
    }

    Object.assign(req[target], result.data);
    return next();
  };
