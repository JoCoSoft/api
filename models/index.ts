import { Sequelize } from "sequelize-typescript";
import Job from "./Job";
import Vent from "./Vent";
import User from "./User";
import Password from "./Password";
import * as dotenv from "dotenv";
dotenv.config();

if (process.env.DATABASE_URL === undefined)
  throw Error("Missing required environment variable 'DATABASE_URL'");

const sequelize = new Sequelize(process.env.DATABASE_URL);
sequelize.addModels([Job, Vent, User, Password]);

// Models should be imported from this file. Importing from the model file itself seems
// to require adding a `sequelize.addModels` call at the bottom of each source file.
export { sequelize, Job, Vent, User, Password };
