import { NextResponse } from "next/server"
import { generateOTP, sendOTPEmail } from "@/lib/sendgrid"

// In-memory OTP storage (in a real app, use a database or Redis)
const otpStore: Record<string, { otp: string; expires: number }> = {}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()

    // Store OTP with 10-minute expiration
    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    }

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp)

    if (!emailSent) {
      return NextResponse.json({ success: false, message: "Failed to send verification code" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Verification code sent" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

