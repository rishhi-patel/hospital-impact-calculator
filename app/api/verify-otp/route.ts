import { NextResponse } from "next/server"
import { authenticator } from "otplib"

// Secure secret key (must match the one used in Send OTP route)
const OTP_SECRET = process.env.OTP_SECRET || "your-secure-secret-key"

// Verify OTP API
export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      )
    }

    // Verify OTP using otplib
    const isValid = authenticator.check(otp, OTP_SECRET)

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
