import { Router, Request, Response } from "express";
import { Job, Vent, sequelize } from "../../models";
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
    data: JSON.stringify({
      id: moveJobData.id,
      serial: moveJobData.serial,
      codeHash: vent.codeHash
    })
  });
  return res.json({ id: job.id }).status(201);
});

router.post("/process", async (req: Request, res: Response) => {
  const serial: string | undefined = req.body.serial;
  if (!serial || serial.trim() === "") {
    return res
      .json({
        error: "The 'serial' is missing from request body."
      })
      .status(400);
  }
  const code: string | undefined = req.body.code;
  if (!code || code.trim() === "") {
    return res
      .json({
        error: "The 'code' is missing from request body."
      })
      .status(400);
  }

  const vent = await Vent.findOne({
    where: {
      serial,
      status: "registered"
    }
  });
  if (!vent) {
    return res
      .json({
        error: "No vent has been registered with the given serial."
      })
      .status(400);
  }

  const codeHashCompare = await bcrypt.compare(code, vent.codeHash);
  if (!codeHashCompare) {
    return res
      .json({
        error: "No vent has been registered with the given serial and code."
      })
      .status(400);
  }
  // TODO Improve performance of the following code by adding
  // migration to use JSONB for easier querying of the data
  // column OR break out certain things to dedicated columns like
  // ventId, ventSerial, ventCodeHash, which might be cleaner...
  const jobs = await Job.findAll({
    order: [["createdAt", "ASC"]]
  });
  const correlatingJobs = jobs.filter(j => {
    const data = JSON.parse(j.data);
    return (
      data.id === vent.id &&
      data.serial === vent.serial &&
      data.codeHash === vent.codeHash
    );
  });

  res
    .json(
      correlatingJobs.map(j => ({
        id: j.id,
        name: j.name,
        data: JSON.parse(j.data),
        createdAt: j.createdAt
      }))
    )
    .status(200);

  // TODO Decide whether we want to DELETE this job here or have the
  // device explicitly tell us when it has completed a job
  correlatingJobs.map(async j => await j.destroy());
  return;
});

export const JobController: Router = router;
