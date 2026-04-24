import { Request, Response, NextFunction, RequestHandler } from "express";
import { BadRequestError } from "../errors/app-error";
import { z, ZodType } from "zod";

type requestTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodType, target: requestTarget = "body"): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const treeError = z.treeifyError(result.error); // field errors + root errors
      const errors: Record<string, string[]> = {};

      for (const [key, val] of Object.entries(treeError)) {
        if (key !== "errors" && val && typeof val === "object") {
          errors[key] = (val as any).errors ?? [];
        }
      }

      if (treeError.errors.length > 0) errors["_root"] = treeError.errors;

      return next(new BadRequestError("Validation failed", errors));
    }

    Object.assign(req[target], result.data);
    return next();
  };
