// Import everything from express and assign it to the express variable
import express from "express";

// Import WelcomeController from controllers entry point
import { JobController } from "./controllers";

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const envPort = process.env.PORT;
const port: number = envPort !== undefined ? parseInt(envPort, 10) : 3000;

// Mount the WelcomeController at the /welcome route
app.use("/job", JobController);

// Serve the application at the given port
app.listen(port, () => {
  // Success callback
  console.log(`Listening at http://localhost:${port}/`);
});
