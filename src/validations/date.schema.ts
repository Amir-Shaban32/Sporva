import { z } from "zod";

export const dateSchema = z.preprocess((d) => {
  if (d instanceof Date) return d;
  const parsed = new Date(d as string);
  return isNaN(parsed.getTime()) ? d : parsed;
}, z.date());
