import express from "express";
import { JobController, VentController } from "./controllers";
import * as dotenv from "dotenv";
dotenv.config();

// Create and configure a new express application
const app: express.Application = express();
app.use(express.json());
app.use("/jobs", JobController);
app.use("/vents", VentController);

const envPort = process.env.PORT;
const port: number = envPort !== undefined ? parseInt(envPort, 10) : 3000;

// Serve the application at the given port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
