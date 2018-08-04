// Import only what we need from express
import { Router, Request, Response } from "express";
import db from "../db/connection";
// Assign router to the express.Router() instance
const router: Router = Router();

// The / here corresponds to the route that the JobController
// is mounted on in the server.ts file.
// In this case it's /welcome
router.get("/", async (req: Request, res: Response) => {
  const results = await db.Connection.query("SELECT * FROM jobs;");
  return res.json(results[0]).status(200);
});

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  await db.Connection.query(
    "INSERT INTO jobs (name, data) VALUES (:name, :data);",
    {
      replacements: { name: req.body.name, data: JSON.stringify(req.body.data) }
    }
  );
  return res.json({}).status(201);
});

// Export the express.Router() instance to be used by server.ts
export const JobController: Router = router;
