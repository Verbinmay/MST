// import { config } from "dotenv";
// import { NextFunction, Request, Response } from "express";

// config();
// export const blogIdMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authorization = req.headers["authorization"];
//     if (authorization) {
//       const [type, token] = authorization.split(" ");
//       if (type === "Basic" && token) {
//         const decoded = Buffer.from(token, "base64").toString("utf-8");
//         const [username, password] = decoded.split(":");
//         if (
//           username === process.env.BASIC_AUTH_LOGIN &&
//           password === process.env.BASIC_AUTH_PASSWORD
//         ) {
//           next();
//           return;
//         }
//       }
//     }
//     res.send(401);
//   } catch (error) {
//     res.send(500);
//   }
// };
