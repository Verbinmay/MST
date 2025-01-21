import { log } from "console";
import { config } from "dotenv";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index";

config();
log(process.env.NODEMAILER_USER);
export const transporter: nodemailer.Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
> = nodemailer.createTransport({
  service: "Mail.ru",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function runNodemailer(): Promise<boolean> {
  try {
    transporter.verify(function (error: Error | null, success: true) {
      if (error) {
        throw error;
      }
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
