import { NextResponse } from "next/server"

// In-memory OTP storage (in a real app, use a database or Redis)
const otpStore: Record<string, { otp: string; expires: number }> = {}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Email and OTP are required" }, { status: 400 })
    }

    const storedData = otpStore[email]

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: "No verification code found for this email" },
        { status: 400 },
      )
    }

    if (Date.now() > storedData.expires) {
      // Clean up expired OTP
      delete otpStore[email]
      return NextResponse.json({ success: false, message: "Verification code has expired" }, { status: 400 })
    }

    if (storedData.otp !== otp) {
      return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 400 })
    }

    // OTP is valid, clean up
    delete otpStore[email]

    return NextResponse.json({ success: true, message: "Email verified successfully" })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

