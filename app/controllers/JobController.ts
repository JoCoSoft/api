import { Router, Request, Response } from "express";
import { Job, Vent } from "../../models";
import * as bcrypt from "bcrypt";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const jobs = await Job.findAll({ order: [["createdAt", "DESC"]] });
  return res
    .json(
      jobs.map(j => ({
        id: j.id,
        name: j.name,
        createdAt: j.createdAt
      }))
    )
    .status(200);
});

interface IMoveJobData {
  id?: string;
  serial?: string;
  code?: string;
}

router.post("/", async (req: Request, res: Response) => {
  const jobName: string | undefined = req.body.name;
  if (
    !jobName ||
    jobName.trim() === "" ||
    ["open", "close"].indexOf(jobName.trim()) < 0
  ) {
    return res
      .json({
        error: "Unable to create job due to invalid/unsupported job name."
      })
      .status(400);
  }

  const moveJobData: IMoveJobData | undefined = req.body.data;
  if (
    !moveJobData ||
    !moveJobData.id ||
    !moveJobData.serial ||
    !moveJobData.code ||
    moveJobData.id.trim() === "" ||
    moveJobData.serial.trim() === "" ||
    moveJobData.code.trim() === ""
  ) {
    return res
      .json({
        error: "Unable to create job with invalid / missing data."
      })
      .status(400);
  }

  const vent = await Vent.findOne({
    where: {
      id: moveJobData.id.trim(),
      serial: moveJobData.serial.trim(),
      status: "registered"
    }
  });

  if (vent === null) {
    return res
      .json({
        error: "Unable to create job without matching vent."
      })
      .status(400);
  }

  if (!(await bcrypt.compare(moveJobData.code.trim(), vent.codeHash))) {
    return res
      .json({
        error: "Unable to create job with invalid code."
      })
      .status(400);
  }

  const job = await Job.create({
    name: req.body.name,
    data: JSON.stringify(moveJobData)
  });
  return res.json({ id: job.id }).status(201);
});

export const JobController: Router = router;
