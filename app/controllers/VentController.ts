import { Router, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Vent } from "../../models";

const router: Router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const registrationCode: string | undefined = req.body.code;

  if (!registrationCode || registrationCode.trim() === "") {
    throw Error("Property 'code' missing from request body.");
  }

  const vents = await Vent.findAll({ where: { status: "manufactured" } });
  let matchingVent: Vent | undefined;
  for (var v of vents) {
    const bcryptCompare = await bcrypt.compare(registrationCode, v.codeHash);
    if (bcryptCompare) {
      matchingVent = v;
      break;
    }
  }

  if (!matchingVent) {
    return res
      .json({
        error:
          "No vent has been manufactured with the given registration code or" +
          " the vent has already been registered."
      })
      .status(400);
  } else {
    await matchingVent.update({ status: "registered" });
    return res.json({ status: matchingVent.status }).status(200);
  }
});

export const VentController: Router = router;
