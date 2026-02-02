import pino from "pino";
import type { Logger, LoggerOptions } from "pino";

type CreateLoggerOptions = LoggerOptions & {
      name: string
}

export const createLogger = (options: CreateLoggerOptions): Logger => {
      const { name, ...rest } = options;
      console.log("logger:",  process.env.NODE_ENV)
      const transport = process.env.NODE_ENV === "development"
            ? {
                  target: "pino-pretty",
                  options: {
                        colorize: true,
                        translateTime: "SYS:standard",
                  },
            }
            : undefined;

      return pino({
            name,
            level: process.env.LOG_LEVEL || 'info',
            transport,
            ...rest
});
}
