import { Sequelize } from "sequelize-typescript";
import Job from "./Job";
import Vent from "./Vent";
import User from "./User";
import Password from "./Password";
import environment from "../environment";

const sequelize = new Sequelize(environment.DATABASE_URL);
sequelize.addModels([Job, Vent, User, Password]);

// Models should be imported from this file. Importing from the model file itself seems
// to require adding a `sequelize.addModels` call at the bottom of each source file.
export { sequelize, Job, Vent, User, Password };
