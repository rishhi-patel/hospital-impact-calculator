import { NextResponse } from "next/server"
import { authenticator } from "otplib"
import { sendOTPEmail } from "@/lib/sendgrid"

// Secure secret key for OTP generation (store in `.env` securely)
const OTP_SECRET = process.env.OTP_SECRET || "your-secure-secret-key"

// Send OTP API
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    // Generate OTP using otplib (valid for 5 minutes)
    const otp = authenticator.generate(OTP_SECRET)

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp)

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification code" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
