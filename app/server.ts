import express from "express";
import { JobController, VentController, UserController } from "./controllers";

// Uncomment to use passport at the router level as opposed to a single route
// import passport from "passport";
// require("./passport");

import * as dotenv from "dotenv";
dotenv.config();

// Create and configure a new express application
const app: express.Application = express();
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
