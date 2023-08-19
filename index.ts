import express, { Request, Response} from "express";
import { performance } from "perf_hooks";
import { NextFunction } from "express";
import fs from "fs";

const app = express();
const port = 3000;

// /**
//  * Parse x-forwarded-for headers.
//  *
//  * @param {string} value - The value to be parsed.
//  * @return {string|null} First known IP address, if any.
//  */
// const is = require('./is');

// function getClientIpFromXForwardedFor(value: any) {
  
//   if (!is.existy(value)) {
//       return null;
//   }

//   if (is.not.string(value)) {
//       throw new TypeError(`Expected a string, got "${typeof value}"`);
//   }

//   // x-forwarded-for may return multiple IP addresses in the format:
//   // "client IP, proxy 1 IP, proxy 2 IP"
//   // Therefore, the right-most IP address is the IP address of the most recent proxy
//   // and the left-most IP address is the IP address of the originating client.
//   // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
//   // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
//   const forwardedIps = value.split(',').map((e : any) => {
//       const ip = e.trim();
//       if (ip.includes(':')) {
//           const splitted = ip.split(':');
//           // make sure we only use this if it's ipv4 (ip:port)
//           if (splitted.length === 2) {
//               return splitted[0];
//           }
//       }
//       return ip;
//   });

//   // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
//   // Therefore taking the right-most IP address that is not unknown
//   // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
//   for (let i = 0; i < forwardedIps.length; i++) {
//       if (is.ip(forwardedIps[i])) {
//           return forwardedIps[i];
//       }
//   }

//   // If no value in the split list is an ip, return null
//   return null;
// }

// /**
// * Determine client IP address.
// *
// * @param req
// * @returns {string} ip - The IP address if known, defaulting to empty string if unknown.
// */
// function getClientIp(req: Request) {
//   // Server is probably behind a proxy.
//   if (req.headers) {
//       // Standard headers used by Amazon EC2, Heroku, and others.
//       if (is.ip(req.headers['x-client-ip'])) {
//           return req.headers['x-client-ip'];
//       }

//       // Load-balancers (AWS ELB) or proxies.
//       const xForwardedFor = getClientIpFromXForwardedFor(
//           req.headers['x-forwarded-for'],
//       );
//       if (is.ip(xForwardedFor)) {
//           return xForwardedFor;
//       }

//       // Cloudflare.
//       // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
//       // CF-Connecting-IP - applied to every request to the origin.
//       if (is.ip(req.headers['cf-connecting-ip'])) {
//           return req.headers['cf-connecting-ip'];
//       }
      
//       // DigitalOcean.
//       // @see https://www.digitalocean.com/community/questions/app-platform-client-ip
//       // DO-Connecting-IP - applied to app platform servers behind a proxy.
//       if (is.ip(req.headers['do-connecting-ip'])) {
//           return req.headers['do-connecting-ip'];
//       }

//       // Fastly and Firebase hosting header (When forwared to cloud function)
//       if (is.ip(req.headers['fastly-client-ip'])) {
//           return req.headers['fastly-client-ip'];
//       }

//       // Akamai and Cloudflare: True-Client-IP.
//       if (is.ip(req.headers['true-client-ip'])) {
//           return req.headers['true-client-ip'];
//       }

//       // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
//       if (is.ip(req.headers['x-real-ip'])) {
//           return req.headers['x-real-ip'];
//       }

//       // (Rackspace LB and Riverbed's Stingray)
//       // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
//       // https://splash.riverbed.com/docs/DOC-1926
//       if (is.ip(req.headers['x-cluster-client-ip'])) {
//           return req.headers['x-cluster-client-ip'];
//       }

//       if (is.ip(req.headers['x-forwarded'])) {
//           return req.headers['x-forwarded'];
//       }

//       if (is.ip(req.headers['forwarded-for'])) {
//           return req.headers['forwarded-for'];
//       }

//       if (is.ip(req.headers.forwarded)) {
//           return req.headers.forwarded;
//       }
  
//   }

//   // Remote address checks.
//   // Deprecated

//   return null;
// }

// /**
// * Expose request IP as a middleware.
// *
// * @param {object} [options] - Configuration.
// * @param {string} [options.attributeName] - Name of attribute to augment request object with.
// * @return {*}
// */
// function mw(options :any) {
//   // Defaults.
//   const configuration = is.not.existy(options) ? {} : options;

//   // Validation.
//   if (is.not.object(configuration)) {
//       throw new TypeError('Options must be an object!');
//   }

//   const attributeName = configuration.attributeName || 'clientIp';
//   return (req: Request, res: Response, next: NextFunction) => {
//       const ip = getClientIp(req);
//       Object.defineProperty(req, attributeName, {
//           get: () => ip,
//           configurable: true,
//       });
//       next();
//   };
// }

// module.exports = {
//   getClientIpFromXForwardedFor,
//   getClientIp,
//   mw,
// };

// Middleware that logs user request information
const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();

  res.on("finish", () => {
    const method = req.method;
    const url = req.originalUrl;
    const timestamp = new Date().toISOString();
    const ipAddress = req.clientIp;
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
        userAgent: userAgent
      };
  
      console.log(JSON.stringify(logMessage));
      fs.appendFile("log.txt", JSON.stringify(logMessage) + "\n", (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      });
  });

  next();
};

// app.use(mw({ attributeName: 'clientIp' }));

// Use the middleware for all routes
app.use(logMiddleware);


// Define routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the home page!");
});

app.get("/test", (req: Request, res: Response) => {
  res.status(200).send("This is the test page.");
});

app.get("/not-found", (req: Request, res: Response) => {
  res.status(404).send("Page not found.");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
