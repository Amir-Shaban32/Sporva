import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodType } from "zod";

export const validate =
  (schema: ZodType): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: z.treeifyError(result.error),
      });
    }

    req.body = result.data;
    return next();
  };
