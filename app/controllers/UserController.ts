import { Router, Request, Response } from "express";
import { User, Password } from "../../models";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw Error(
    "Unable to proceed without require JWT_SECRET environment variable"
  );
}

const router: Router = Router();

router.post("/sign-in", async (req: Request, res: Response) => {
  passport.authenticate(
    "local",
    { session: false },
    (err, userModel: User, info) => {
      if (err || !userModel) {
        return res.status(400).json({
          message: "Authentication error",
          user: !userModel ? null : userModel.toJSON()
        });
      }

      const user = userModel.toJSON();
      req.login(user, { session: false }, err => {
        if (err) {
          res.send(err);
        }
        // generate a signed json web token with the contents
        // of user object and return it in the response
        const token = jwt.sign(user, jwtSecret);
        return res.json({ user: user, token });
      });
    }
  )(req, res);
});

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
    return res.status(400).json({ errors: validationErrors });
  }

  const users = await User.count({
    where: { email: email!.trim() }
  });

  if (users > 0) {
    return res.status(400).json({
      errors: [
        {
          name: "Email",
          error: "A user with that email already exists. Try signing in."
        }
      ]
    });
  }

  const user = await User.create({
    email: email!.trim(),
    name: name!.trim()
  });
  await Password.create({
    password: await bcrypt.hash(password, await bcrypt.genSalt(12)),
    userId: user.id
  });

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name
  });
});

export const UserController: Router = router;
