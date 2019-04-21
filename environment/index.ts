import * as dotenv from "dotenv";
import fs from "fs";

type TUnvalidatedEnv =
  | NodeJS.ProcessEnv
  | {
      [key: string]: string;
    };
type TEnvironment = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  ENABLE_CORS?: boolean;
};

const getDotEnv = () => {
  const env = dotenv.parse(fs.readFileSync(".env"));
  console.log(`Development environment: ${JSON.stringify(env)}`);
  return env;
};
const getValidatedEnv = (unvalidatedEnv: TUnvalidatedEnv): TEnvironment => {
  if (
    typeof unvalidatedEnv.NODE_ENV !== "string" ||
    unvalidatedEnv.NODE_ENV.trim() === ""
  ) {
    throw Error("Missing NODE_ENV environment variable.");
  }
  if (
    typeof unvalidatedEnv.DATABASE_URL !== "string" ||
    unvalidatedEnv.DATABASE_URL.trim() === ""
  ) {
    throw Error("Missing DATABASE_URL environment variable.");
  }
  if (
    typeof unvalidatedEnv.JWT_SECRET !== "string" ||
    unvalidatedEnv.JWT_SECRET.trim() === ""
  ) {
    throw Error("Missing JWT_SECRET environment variable.");
  }

  return {
    NODE_ENV: unvalidatedEnv.NODE_ENV,
    PORT:
      typeof unvalidatedEnv.PORT !== "undefined"
        ? parseInt(unvalidatedEnv.PORT, 10)
        : 3000,
    DATABASE_URL: unvalidatedEnv.DATABASE_URL,
    JWT_SECRET: unvalidatedEnv.JWT_SECRET,
    ENABLE_CORS:
      typeof unvalidatedEnv.ENABLE_CORS === "string" &&
      unvalidatedEnv.ENABLE_CORS.trim().toLowerCase() === "true"
  };
};
const environment: TEnvironment = getValidatedEnv(
  process.env.NODE_ENV === "production" ? process.env : getDotEnv()
);

export default environment;
