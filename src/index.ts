import { app } from "./app";
import { runDB } from "./db/db_mongo";
import { runNodemailer } from "./mailer/nodemailer";
import { SETTINGS } from "./settings";

async function startApp() {
  try {
    const isDbRun: boolean = await runDB();
    const isNodemailerRun: boolean = await runNodemailer();

    if (!isDbRun || !isNodemailerRun) {
      throw new Error(`isNodemailerRun or isDbRun made error`);
    }

    app.listen(SETTINGS.PORT, () => {
      console.log("...server started in port " + SETTINGS.PORT);
    });
  } catch (error) {
    console.error("Failed to start the app:", error);
    process.exit(1);
  }
}

startApp();
