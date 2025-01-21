import { nodemailerRepository } from "../../src/mailer/nodemailer-repository";

test("should send message", async () => {
  const messageInfo = await nodemailerRepository.sendEmail(
    "markomaistrenko@gmail.com",
    "testing",
    "test message"
  );
  expect(messageInfo).toBe(true);
});
