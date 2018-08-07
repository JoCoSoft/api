import { Router, Request, Response } from "express";
import { Job } from "../../models";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const jobs = await Job.findAll({ order: [["createdAt", "DESC"]] });
  return res.json(jobs).status(200);
});

router.post("/", async (req: Request, res: Response) => {
  const job = await Job.create({
    name: req.body.name,
    data: JSON.stringify(req.body.data)
  });
  return res.json({ id: job.id }).status(201);
});

export const JobController: Router = router;
