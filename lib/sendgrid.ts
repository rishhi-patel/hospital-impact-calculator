import { Resend } from "resend"

// Securely load API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY || ""
const resend = new Resend(resendApiKey)

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email using Resend (Improved Version)
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: "hello@exocodelabs.tech", // ✅ FIX: Use your verified domain email
      to: email,
      subject: "Your Verification Code - Surgical Performance Estimator",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2C6150; text-align: center;">Surgical Performance Estimator</h2>
          <p>Dear User,</p>
          <p>Thank you for using the Surgical Performance Estimator. To complete your verification, please use the following code:</p>
          <div style="background-color: #f4f7f7; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes. If you did not request this code, please ignore this email or contact our support team.</p>
          <p>Best regards,</p>
          <p>The Surgical Performance Estimator Team</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #888888; text-align: center;">
            This email was sent to ${email}. If you have any questions, please contact us at support@yourdomain.com.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend API Error:", error)
      return false
    }

    console.log("Email sent successfully:", data)
    return true
  } catch (error) {
    console.error("Unexpected Error Sending Email:", error)
    return false
  }
}

interface SendEmailResponse {
  data: any
  error: any
}

export const sendEmailWithPDFBlob = async (
  email: string,
  pdfBlob: Blob
): Promise<void> => {
  const reader = new FileReader()

  reader.readAsDataURL(pdfBlob)
  reader.onloadend = async function () {
    const base64PDF =
      typeof reader.result === "string" ? reader.result.split(",")[1] : "" // Get the base64 string

    try {
      const response: SendEmailResponse = await resend.emails.send({
        from: "info@sifiohealth.com",
        to: email,
        subject: "SurgiTwin™ Performance Insights",
        text: "Please find your detailed surgical performance report attached.",
        attachments: [
          {
            content: base64PDF,
            filename: "SurgiTwin_Performance_Report.pdf",
          },
        ],
      })

      console.log("Email sent with attached PDF: ", response)
    } catch (error) {
      console.error("Error sending email via Resend:", error)
    }
  }
}
