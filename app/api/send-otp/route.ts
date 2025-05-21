import { NextResponse } from "next/server"
import { authenticator } from "otplib"
// import { sendOTPEmail } from "@/lib/sendgrid"

const OTP_SECRET = process.env.OTP_SECRET || "your-secure-secret-key"

authenticator.options = { window: 1 } // Allow small clock drift (±30s)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    const userSecret = `${OTP_SECRET}-${email}`
    const otp = authenticator.generate(userSecret)

    // Send OTP email here
    // const emailSent = await sendOTPEmail(email, otp)

    // For development/testing: send OTP in response instead of email
    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      otp,
    })

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
