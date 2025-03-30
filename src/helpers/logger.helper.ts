import winston from "winston";

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = this.initializeLogger();
  }

  private level(): string {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
  }

  private initializeLogger(): winston.Logger {
    // Define custom log level colors
    const colors: winston.config.AbstractConfigSetColors = {
      error: "red",
      warn: "yellow",
      info: "green",
      http: "magenta",
      debug: "white",
    };

    // Add colors to winston
    winston.addColors(colors);

    // Define format
    const format = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    );

    // Define transports
    const transports: winston.transport[] = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({ filename: "logs/all.log" }),
    ];

    // Create and return the logger instance
    return winston.createLogger({
      level: this.level(),
      format,
      transports,
    });
  }

  public silly(message: string): void {
    this.logger.silly(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public verbose(message: string): void {
    this.logger.verbose(message);
  }

  public http(message: string): void {
    this.logger.http(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }
}

export default new Logger();
