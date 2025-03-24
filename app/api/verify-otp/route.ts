import { NextResponse } from "next/server"
import { authenticator } from "otplib"

const OTP_SECRET = process.env.OTP_SECRET || "your-secure-secret-key"

authenticator.options = { window: 1 } // Allow small time drift

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (
      !email ||
      typeof email !== "string" ||
      !otp ||
      typeof otp !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      )
    }

    const userSecret = `${OTP_SECRET}-${email}`
    const isValid = authenticator.check(otp, userSecret)

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
