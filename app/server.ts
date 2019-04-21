import express from "express";
import { JobController, VentController, UserController } from "./controllers";
import cors from "cors";
import environment from "../environment";
// Uncomment to use passport at the router level as opposed to a single route
// import passport from "passport";
// require("./passport");

// Create and configure a new express application
const app: express.Application = express();

if (environment.ENABLE_CORS === true) {
  // Docs: https://ionicframework.com/docs/faq/cors#local-development-in-the-browser
  const allowedOrigins = [
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8100",
    "https://localhost:4200"
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

// Serve the application at the given port
app.listen(environment.PORT, () => {
  console.log(`Server listening on port ${environment.PORT}`);
});
