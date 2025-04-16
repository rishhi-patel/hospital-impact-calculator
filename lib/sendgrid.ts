import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey)
  throw new Error("RESEND_API_KEY is not defined in the environment")

const resend = new Resend(resendApiKey)

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Shared HTML email wrapper
function getEmailHTML(
  title: string,
  body: string,
  footerNote?: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2C6150; text-align: center;">Sifio Health</h2>
      ${body}
      <p>Best regards,</p>
      <p>Sifio Health Team</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #888; text-align: center;">
        ${footerNote || "This is an automated email from Sifio Health."}
      </p>
    </div>
  `
}

// Send OTP email
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  const htmlBody = getEmailHTML(
    "Sifio Health",
    `
      <p>Dear User,</p>
      <p>Thank you for using the Surgical Performance Estimator. Use the following code to complete verification:</p>
      <div style="background: #f4f7f7; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes. If you did not request it, please ignore this email or contact support.</p>
    `,
    `This email was sent to ${email}. For queries, contact info@sifiohealth.com.`
  )

  return await sendEmail(
    email,
    "Your Verification Code - Sifio Health",
    htmlBody
  )
}

// Send detailed report email with attachment
export async function sendDetailedReportEmail(
  email: string,
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<boolean> {
  try {
    const base64 = buffer.toString("base64")

    const htmlBody = getEmailHTML(
      "Sifio Health",
      `
      <p>Dear User,</p>
      <p>Thank you for using the Surgical Performance Estimator. Please find your detailed report attached to this email.</p>
      <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:info@sifiohealth.com" style="color: #2C6150; text-decoration: none;">info@sifiohealth.com</a>.</p>
      `,
      `This email was sent to ${email}. For queries, contact info@sifiohealth.com.`
    )

    const { error } = await resend.emails.send({
      from: "noreply@sifiohealth.com",
      to: email,
      subject: "Your Detailed Report - Sifio Health",
      html: htmlBody,
      attachments: [
        {
          content: base64,
          filename: fileName,
        },
      ],
    })

    if (error) throw error
    return true
  } catch (err) {
    console.error("❌ Resend email error:", err)
    return false
  }
}
// Generic reusable send email function
async function sendEmail(
  email: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: "noreply@sifiohealth.com",
      to: email,
      subject,
      html,
    })

    if (error) throw error
    console.log("Email sent successfully to", email)
    return true
  } catch (err) {
    console.error("Error sending email:", err)
    return false
  }
}
