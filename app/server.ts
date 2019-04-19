import express from "express";
import { JobController, VentController, UserController } from "./controllers";
import cors from "cors";
// Uncomment to use passport at the router level as opposed to a single route
// import passport from "passport";
// require("./passport");

import * as dotenv from "dotenv";
dotenv.config();

// Create and configure a new express application
const app: express.Application = express();

const envEnableCors = process.env.ENABLE_CORS;
if (
  typeof envEnableCors === "string" &&
  envEnableCors.trim().toLowerCase() === "true"
) {
  // Docs: https://ionicframework.com/docs/faq/cors#local-development-in-the-browser
  const allowedOrigins = [
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8100"
  ];

  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  const corsOptions = {
    origin: (origin: any, callback: any) => {
      if (allowedOrigins.indexOf(origin) > -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    }
  };

  // Enable preflight requests for all routes
  app.options("*", cors(corsOptions));

  // Enable CORS as router middleware
  app.use(cors(corsOptions));
}

app.use(express.json());
app.use("/api/v1/jobs", JobController);
app.use("/api/v1/vents", VentController);
app.use("/api/v1/users", UserController);

const envPort = process.env.PORT;
const port: number = envPort !== undefined ? parseInt(envPort, 10) : 3000;

// Serve the application at the given port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
