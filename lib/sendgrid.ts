import { Resend } from "resend"

// Securely load API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY || ""
const resend = new Resend(resendApiKey)

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email using Resend (Corrected Version)
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: "hello@exocodelabs.tech", // ✅ FIX: Use your verified domain email
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2C6150;">Surgical Performance Estimator</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f7f7; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
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
