import pino from "pino";
import { env } from "../config";

const isDev = env.NODE_ENV === "development";

const transport = pino.transport({
  targets: [
    ...(isDev ? [{ target: "pino-pretty" }] : []),
    ...(!isDev
      ? [
          {
            target: "@logtail/pino",
            options: { sourceToken: env.BETTER_STACK_TOKEN },
          },
        ]
      : []),
    {
      target: "pino/file",
      options: { destination: "./logs/app.log", mkdir: true },
    },
  ],
});

export const logger = pino({ level: env.PINO_LOG_LEVEL }, transport);
