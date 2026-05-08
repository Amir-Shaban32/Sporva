import PinoHttp from "pino-http";
import { logger } from "../config";

const httpLogger = PinoHttp({
  logger,
  genReqId: (req) => req.id,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true,
  },
  customLogLevel: (_req, res) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    else return "info";
  },
});

export default httpLogger;
