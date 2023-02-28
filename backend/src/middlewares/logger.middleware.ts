import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

/**
 * A middleware that logs according to HTTP requests
 * and return logs including the method, original URL, IP address, and user agent of the request,
 * as well as the content length and status code of the response
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: any, res: any, next: (error?: any) => void) {
    const { method, ip, originalUrl } = req;
    const userAgent = req.get("user-agent") || "";

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
      );
    });

    next();
  }
}
