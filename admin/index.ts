import * as bcrypt from "bcrypt";
import { Vent } from "../models";

(async () => {
  const args = process.argv.slice(2);
  const consoleLogColors = {
    reset: "\x1b[0m",
    foregroundRed: "\x1b[31m"
  };

  function printError(errorMessage: string) {
    console.log(
      `${consoleLogColors.foregroundRed}%s${consoleLogColors.reset}`,
      errorMessage
    );
  }

  function printHelp() {
    console.log(`
### Usage ###

add-vent  Adds a vent to the vents table
          Example: \`node index.js add-vent -serial IntelliVent -code 1nt3ll1v3nt\`
  `);
  }

  async function executeCommand(command: string, commandArgs: string[]) {
    console.log(command, commandArgs);
    switch (command) {
      case "add-vent":
        if (
          commandArgs.length !== 4 ||
          commandArgs[0].trim() !== "-serial" ||
          commandArgs[1].trim() === "" ||
          commandArgs[2].trim() !== "-code" ||
          commandArgs[3].trim() === ""
        ) {
          printError(
            "add-vent expects exactly 4 args." +
              " The first should be '-serial', followed by the serial number." +
              " The first should be '-code', followed by the code."
          );
          printHelp();
          return;
        }

        const serial = commandArgs[1].trim();
        const code = commandArgs[3].trim();
        const codeHash = await bcrypt.hash(code, await bcrypt.genSalt(12));
        console.log(serial, code, codeHash);
        const vent = await Vent.create({
          serial,
          codeHash,
          status: "manufactured"
        });
        console.log(`Vent created: ${JSON.stringify(vent.toJSON())}`);
    }
  }

  if (args.length < 3) printHelp();

  try {
    await executeCommand(args[0], args.slice(1));
  } catch (error) {
    printError(error);
  } finally {
    process.exit();
  }
})();
