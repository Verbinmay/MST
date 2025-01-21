import { randomUUID } from "crypto";
import { InsertOneResult, ObjectId } from "mongodb";

import { MessageDBModel } from "../types/messages/MessageDBModel.type";
import { MessageInputModel } from "../types/messages/MessageInputModel.type";
import { nodemailerRepository } from "./nodemailer-repository";

export const nodemailerService = {
  async saveMail(dto: MessageInputModel) {
    const message: MessageDBModel = {
      _id: new ObjectId(),
      id: randomUUID(),
      createAt: new Date().toISOString(),
      ...dto,
    };
    const result: InsertOneResult<Document> =
      await nodemailerRepository.createMail(message);
    return result;
  },

  async sendMail(to: string, text: string, dto: MessageInputModel) {
    const resultOfSending: boolean = await nodemailerRepository.sendEmail(
      to,
      dto.type,
      text
    );
    if (resultOfSending) {
      const resultOfSaving: InsertOneResult<Document> = await this.saveMail(
        dto
      );
      if (resultOfSaving.insertedId) return true;
    }
    return false;
  },
};
