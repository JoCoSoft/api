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
  degrees?: number;
}

router.post("/", async (req: Request, res: Response) => {
  const requestJobs = req.body instanceof Array ? req.body : [req.body];
  const createdJobs: { idx: number; id: string }[] = [];
  const errors: { idx: number; error: string }[] = [];

  for (let idx = 0; idx < requestJobs.length; idx++) {
    const requestJob = requestJobs[idx];
    const jobName: string | undefined = requestJob.name;
    if (
      !jobName ||
      jobName.trim() === "" ||
      // TODO Refactor when adding different job types
      ["open", "close"].indexOf(jobName.trim()) < 0
    ) {
      errors.push({
        idx,
        error: "Unable to create job due to invalid/unsupported job name."
      });
      continue;
    }

    const moveJobData: IMoveJobData | undefined = requestJob.data;
    if (
      !moveJobData ||
      !moveJobData.id ||
      !moveJobData.serial ||
      !moveJobData.code ||
      moveJobData.id.trim() === "" ||
      moveJobData.serial.trim() === "" ||
      moveJobData.code.trim() === ""
    ) {
      errors.push({
        idx,
        error: "Unable to create job with invalid / missing data."
      });
      continue;
    }

    console.log(moveJobData);
    const vent = await Vent.findOne({
      where: {
        id: moveJobData.id.trim(),
        serial: moveJobData.serial.trim(),
        status: "registered"
      }
    });

    if (vent === null) {
      errors.push({
        idx,
        error: "Unable to create job without matching vent."
      });
      continue;
    }

    if (!(await bcrypt.compare(moveJobData.code.trim(), vent.codeHash))) {
      errors.push({
        idx,
        error: "Unable to create job with invalid code."
      });
      continue;
    }

    const createdJob = await Job.create({
      name: jobName,
      data: JSON.stringify({
        id: moveJobData.id,
        serial: moveJobData.serial,
        codeHash: vent.codeHash,
        degrees: moveJobData.degrees || 90
      })
    });

    createdJobs.push({
      idx,
      id: createdJob.id
    });
  }

  const status = errors.length > 0 && createdJobs.length === 0 ? 400 : 200;
  return res
    .json({
      createdJobs,
      errors
    })
    .status(status);
});

router.post("/process", async (req: Request, res: Response) => {
  const serial: string | undefined = req.body.serial;
  if (!serial || serial.trim() === "") {
    return res
      .json({
        error: "The 'serial' field is missing or empty."
      })
      .status(400);
  }
  const code: string | undefined = req.body.code;
  if (!code || code.trim() === "") {
    return res
      .json({
        error: "The 'code' field is missing or empty."
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
