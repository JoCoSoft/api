import Sequelize from "sequelize";

if (process.env.DATABASE_URL === undefined)
  throw Error("Missing required environment variable 'DATABASE_URL'");

export default { Connection: new Sequelize(process.env.DATABASE_URL) };
