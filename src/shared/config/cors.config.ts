import cors, { CorsOptionsDelegate, CorsOptions } from "cors";
import { env } from "../config";

const allowedOrigins =
  env.NODE_ENV === "production"
    ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [`http://localhost:${env.PORT}`];

const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  const origin = req.headers.origin;
  let corsOptions: CorsOptions;

  if (!origin) corsOptions = { origin: true };
  else if (allowedOrigins.includes(origin)) corsOptions = { origin: true };
  else corsOptions = { origin: false };

  callback(null, {
    ...corsOptions,
    credentials: true,
    maxAge: 86400,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
  });
};

export const corsConfig = cors(corsOptionsDelegate);
