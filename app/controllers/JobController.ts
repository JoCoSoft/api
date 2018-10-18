import { Router, Request, Response } from "express";
import { Job, Vent, sequelize } from "../../models";
import * as bcrypt from "bcrypt";
import passport from "passport";
require("../passport");

const router: Router = Router();

// TODO
// Eventually remove or secure
router.get("/", async (req: Request, res: Response) => {
  const jobs = await Job.findAll({ order: [["createdAt", "DESC"]] });
  return res.status(200).json(
    jobs.map(j => ({
      id: j.id,
      name: j.name,
      createdAt: j.createdAt
    }))
  );
});

interface IMoveJobData {
  id?: string;
  serial?: string;
  code?: string;
  degrees?: number;
}

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
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
    return res.status(status).json({
      createdJobs,
      errors
    });
  }
);

router.post("/process", async (req: Request, res: Response) => {
  const serial: string | undefined = req.body.serial;
  if (!serial || serial.trim() === "") {
    return res.status(400).json({
      error: "The 'serial' field is missing or empty."
    });
  }
  const code: string | undefined = req.body.code;
  if (!code || code.trim() === "") {
    return res.status(400).json({
      error: "The 'code' field is missing or empty."
    });
  }

  const vent = await Vent.findOne({
    where: {
      serial,
      status: "registered"
    }
  });
  if (!vent) {
    return res.status(400).json({
      error: "No vent has been registered with the given serial."
    });
  }

  const codeHashCompare = await bcrypt.compare(code, vent.codeHash);
  if (!codeHashCompare) {
    return res.status(400).json({
      error: "No vent has been registered with the given serial and code."
    });
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

  res.status(200).json(
    correlatingJobs.map(j => ({
      id: j.id,
      name: j.name,
      data: JSON.parse(j.data),
      createdAt: j.createdAt
    }))
  );

  // TODO Decide whether we want to DELETE this job here or have the
  // device explicitly tell us when it has completed a job
  correlatingJobs.map(async j => await j.destroy());
  return;
});

export const JobController: Router = router;
