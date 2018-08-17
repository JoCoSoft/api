import { Router, Request, Response } from "express";
import { User, Password } from "../../models";
import * as bcrypt from "bcrypt";

const router: Router = Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  const name: string | undefined = req.body.name;
  const email: string | undefined = req.body.email;
  const password: string | undefined = req.body.password;
  const confirmPassword: string | undefined = req.body.confirmPassword;
  const validationErrors: { name: string; error: string }[] = [];

  if (!name || name.trim() === "") {
    validationErrors.push({
      name: "Name",
      error: "The 'Name' field is missing or empty."
    });
  }
  if (!email || email.trim() === "") {
    validationErrors.push({
      name: "Email",
      error: "The 'Email' field is missing or empty."
    });
  }
  if (!password || password.trim() === "") {
    validationErrors.push({
      name: "Password",
      error: "The 'Password' field is missing or empty."
    });
  }
  if (
    password &&
    password.trim() !== "" &&
    (!confirmPassword || confirmPassword.trim() !== password.trim())
  ) {
    validationErrors.push({
      name: "Confirm Password",
      error: "The 'Confirm Password' field is missing or empty."
    });
  }

  if (validationErrors.length > 0) {
    return res.json({ errors: validationErrors }).status(400);
  }

  const users = await User.count({
    where: { email: email!.trim() }
  });

  if (users > 0) {
    return res
      .json({
        errors: [
          {
            name: "Email",
            error: "A user with that email already exists. Try signing in."
          }
        ]
      })
      .status(400);
  }

  const user = await User.create({
    email: email!.trim(),
    name: name!.trim()
  });
  await Password.create({
    password: await bcrypt.hash(password, await bcrypt.genSalt(12)),
    userId: user.id
  });

  return res
    .json({ id: user.id, email: user.email, name: user.name })
    .status(201);
});

export const UserController: Router = router;
