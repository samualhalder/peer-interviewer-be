import { Resend } from "resend";
import loggerHelper from "./logger.helper";

const apiKey = process.env.RESEND_API_KEY;
const clientUrl = process.env.CLIENT_URL as string;
const resend = new Resend(apiKey);

export async function sendMail(mail: string, token: string) {
  const body = `
<div>
  <p>Hello, please click the link below to reset your password.</p>
  <p>the reset password session will be valid till the next 3 hrs from the mail generation</p>
  <a
    href="${clientUrl}/reset-password?token=${token}"
    style="
      display: inline-block;
      padding: 10px 16px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    "
  >
    Reset Password
  </a>

  <p style="margin-top: 12px;">
    Or copy this link:
    <br />
    ${clientUrl}/reset-password?token=${token}
  </p>
</div>
`;

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
