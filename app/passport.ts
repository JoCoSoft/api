import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import { User, Password } from "../models";
import * as bcrypt from "bcrypt";

passport.use(
  new passportLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async function(email, password, callback) {
      const user = await User.findOne({ where: { email: email.trim() } });
      if (!user) {
        return callback(Error("No user found with that email"));
      }
      const userPassword = await Password.findOne({
        where: { userId: user.id },
        order: [["createdAt", "DESC"]]
      });
      if (!userPassword) {
        return callback(Error("No password record found for that email"));
      }
      const passwordMatches = await bcrypt.compare(
        password,
        userPassword.password
      );
      return passwordMatches
        ? callback(null, user, { message: "Authentication successful!" })
        : callback(null, false, {
            message: "Authentication failed"
          });
    }
  )
);

const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw Error(
    "Unable to proceed without require JWT_SECRET environment variable"
  );
}

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    },
    function(jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);
