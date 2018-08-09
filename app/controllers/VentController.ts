import { Router, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Vent } from "../../models";

const router: Router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const serial: string | undefined = req.body.serial;
  if (!serial || serial.trim() === "") {
    throw Error("The 'serial' is missing from request body.");
  }
  const code: string | undefined = req.body.code;
  if (!code || code.trim() === "") {
    throw Error("The 'code' is missing from request body.");
  }

  const vent = await Vent.findOne({
    where: {
      serial,
      status: "manufactured"
    }
  });
  if (!vent) {
    return res
      .json({
        error:
          "No vent has been manufactured with the given serial or the vent has already been registed"
      })
      .status(400);
  }

  const codeHashCompare = await bcrypt.compare(code, vent.codeHash);
  if (!codeHashCompare) {
    return res
      .json({
        error: "No vent has been manufactured with the given serial and code."
      })
      .status(400);
  }

  await vent.update({ status: "registered" });
  return res.json({ status: vent.status }).status(200);
});

export const VentController: Router = router;
