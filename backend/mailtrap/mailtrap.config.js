import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();


export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.ENDPOINT
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Sandeep"
};


