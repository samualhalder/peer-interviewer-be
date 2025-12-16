import { Resend } from "resend";
import loggerHelper from "./logger.helper";

const apiKey = process.env.RESEND_API_KEY;
const clientUrl = process.env.CLIENT_URL;
const resend = new Resend(apiKey);

export async function sendMail(mail: string, token: string) {
  const body = `<div>Hello pls click below link to reset the password. <p>${clientUrl}/reset-password?token=${token}</p> </div>`;
  const { data, error } = await resend.emails.send({
    from: "Peer Interviewer <onboarding@resend.dev>",
    to: [mail],
    subject: " Password reset",
    html: body,
  });

  if (error) {
    loggerHelper.error(error.message);
    return "Something Went wrong";
  }

  return "Mail send succesfully";
}
