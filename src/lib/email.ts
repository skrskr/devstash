import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "onboarding@resend.dev";
const APP_URL = process.env.AUTH_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your DevStash email",
    html: `
      <p>Thanks for signing up for DevStash!</p>
      <p>Click the link below to verify your email address. The link expires in 24 hours.</p>
      <p><a href="${verifyUrl}">Verify email</a></p>
      <p>Or copy this URL into your browser:</p>
      <p>${verifyUrl}</p>
    `,
  });
}
