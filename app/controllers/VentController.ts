import { Router, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Vent } from "../../models";

const router: Router = Router();

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

  await vent.update({ status: "registered" });
  return res.status(200).json({ id: vent.id, status: vent.status });
});

export const VentController: Router = router;
