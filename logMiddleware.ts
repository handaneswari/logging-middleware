import { Request, Response, NextFunction } from "express";
import { performance } from "perf_hooks";
import fs from "fs";
import { printColoredText, ConsoleColors } from "./colors" ; // Make sure to update the import paths as needed

export const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();

  res.on("finish", () => {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();
    const statusCode = res.statusCode;
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    const userAgent = req.headers["user-agent"];

    const logMessage = {
      method: method,
      timestamp: timestamp,
      url: url,
      statusCode: statusCode,
      duration: duration + "ms",
      userAgent: userAgent,
    };

    let color: ConsoleColors = ConsoleColors.White; // Default to white color
    
    if (statusCode === 404) {
      // Set color to red if statusCode is 404
      color = ConsoleColors.Red;
    } else {
      // Set color to green if statusCode is not 404
      color = ConsoleColors.Green;
    }
    

    const consoleLog = `[${timestamp}]: ${statusCode} ${method} ${url}`;
    printColoredText(consoleLog, color);

    fs.appendFile("log.txt", JSON.stringify(logMessage) + "\n", (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  });

  next();
};
