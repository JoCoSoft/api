import { Router, Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import { Vent, User } from "../../models";
import { Op } from "sequelize";
import passport from "passport";

// Include our passport setup
require("../passport");

const router: Router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    const user: User | null = req.user;
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const userVents = await Vent.findAll({
      where: {
        status: "registered",
        userId: user.id
      }
    });
    const vents = userVents.map(v => ({
      id: v.id,
      serial: v.serial
    }));
    return res.status(200).json({
      vents
    });
  }
);

router.post("/register", async (req: Request, res: Response) => {
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
  const userId: string = (typeof req.body.userId === "string"
    ? req.body.userId
    : ""
  ).trim();
  if (userId === "" || !(await User.findByPk(userId))) {
    return res.status(400).json({
      error: "The 'userId' field is missing, empty, or invalid."
    });
  }

  const vent = await Vent.findOne({
    where: {
      serial,
      status: "manufactured"
    }
  });
  if (!vent) {
    return res.status(400).json({
      error:
        "No vent has been manufactured with the given serial or the vent has already been registered."
    });
  }

  const codeHashCompare = await bcrypt.compare(code, vent.codeHash);
  if (!codeHashCompare) {
    return res.status(400).json({
      error: "No vent has been manufactured with the given serial and code."
    });
  }

  await vent.update(
    { status: "registered", userId },
    { where: { status: { [Op.not]: "registered" }, userId: null } }
  );

  return res.status(200).json({
    id: vent.id,
    status: vent.status
  });
});

export const VentController: Router = router;
