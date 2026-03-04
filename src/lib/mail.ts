import { Resend } from "resend";

import env from "./env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, url: string) {
  await resend.emails.send({
    from: "onbarding@resend.dev",
    to,
    subject: "Confirm your email",
    html: `<p>Click <a href="${url}">here</a> to confirm your email.</p>`,
  });
}

export async function sendResetPasswordEmail(to: string, url: string) {
  await resend.emails.send({
    from: "onbarding@resend.dev",
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
}
