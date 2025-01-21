import { InsertOneResult } from "mongodb";
import SMTPTransport from "nodemailer/lib/smtp-transport/index";

import { messagesCollection } from "../db/db_mongo";
import { MessageDBModel } from "../types/messages/MessageDBModel.type";
import { transporter } from "./nodemailer";

export const nodemailerRepository = {
  async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
    try {
      const messageInfo: SMTPTransport.SentMessageInfo =
        await transporter.sendMail({
          from: process.env.NODEMAILER_USER,
          to,
          subject,
          html: text,
        });
      if (messageInfo.rejected.length > 0) {
        console.error(`Message rejected: ${messageInfo.rejected}`);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async createMail(dto: MessageDBModel): Promise<InsertOneResult> {
    return await messagesCollection.insertOne(dto);
  },

  async findMailsByUserId(userId: string): Promise<Array<MessageDBModel>> {
    const messages: Array<MessageDBModel> = await messagesCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return messages;
  },
  //TODO: Implement deleteOldMails (check time)
  // async deleteOldMails() {
  //   const result = await messagesCollection.deleteMany({
  //     createdAt: {
  //       $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(),
  //     },
  //   });
  //   return result.deletedCount;
  // },
};
