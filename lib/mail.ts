import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail({
  to,
  userName,
  ticketTitle,
  ticketId,
  adminMessage,
}: {
  to: string;
  userName: string;
  ticketTitle: string;
  ticketId: string;
  adminMessage: string;
}) {
  await resend.emails.send({
    from: "Fastighet <onboarding@resend.dev>",
    to,
    subject: `Nytt svar på ditt ärende: ${ticketTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #7C3AED; width: 40px; height: 40px; border-radius: 10px; margin-bottom: 24px;"></div>
        
        <h1 style="font-size: 22px; font-weight: 600; color: #111827; margin: 0 0 8px;">
          Nytt svar på ditt ärende
        </h1>
        
        <p style="color: #6B7280; font-size: 14px; margin: 0 0 24px;">
          Hej ${userName}! Admin har svarat på ditt ärende.
        </p>

        <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 6px; text-transform: uppercase; font-weight: 500;">
            Ärende
          </p>
          <p style="font-size: 15px; font-weight: 500; color: #111827; margin: 0 0 16px;">
            ${ticketTitle}
          </p>
          <p style="font-size: 12px; color: #9CA3AF; margin: 0 0 6px; text-transform: uppercase; font-weight: 500;">
            Meddelande från admin
          </p>
          <p style="font-size: 14px; color: #374151; margin: 0;">
            ${adminMessage}
          </p>
        </div>

        <a 
          href="${process.env.NEXTAUTH_URL}/tickets/${ticketId}"
          style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;"
        >
          Visa ärende
        </a>

        <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
          Fastighet Ärendesystem
        </p>
      </div>
    `,
  });
}