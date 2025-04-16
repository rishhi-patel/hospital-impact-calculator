"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

type EmailVerificationProps = {}

export function EmailVerification({}: EmailVerificationProps) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpVisible, setIsOtpVisible] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOtpVisible) {
      toast({
        title: "Verification code sent",
        description: "We've sent a 6-digit code to your email address.",
      })
    }
  }, [isOtpVisible, toast])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").trim()

    if (!/^\d{6}$/.test(pasted)) return

    const digits = pasted.split("").slice(0, 6)
    setOtp(digits)

    const lastInput = document.getElementById("otp-5")
    if (lastInput) lastInput.focus()
  }

  const sendOTP = async () => {
    if (!email) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to send OTP")

      setIsOtpVisible(true)
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send verification code",
        variant: "destructive",
      })
    }
  }

  const verifyOTP = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter all 6 digits of the verification code.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to verify OTP")

      toast({
        title: "Verification successful",
        description: "Your email has been verified successfully.",
      })

      setIsVerified(true)

      // Call HubSpot
      await handleHubSpotContact(email)

      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          encoded: localStorage.getItem("encoded"),
        }),
      })
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to verify verification code",
        variant: "destructive",
      })
    }
  }

  const handleHubSpotContact = async (email: string): Promise<void> => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : {}
      if (!response.ok)
        throw new Error(
          data.message || "Failed to create/update contact in HubSpot"
        )

      console.log("HubSpot contact created/updated:", data)
    } catch (error) {
      console.error("Error with HubSpot API:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create or update HubSpot contact",
        variant: "destructive",
      })
    }
  }

  const handleResendCode = () => {
    sendOTP()
    toast({
      title: "New code sent",
      description: "We've sent a new verification code to your email.",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isVerified ? (
        <Card className="p-6 shadow-sm border rounded-lg text-center">
          <p className="text-xl font-semibold text-primary mb-2">
            Thank you for verifying your email!
          </p>
          <p className="text-gray-700">
            Your report will be shared with you soon.
          </p>
        </Card>
      ) : (
        <Card className="p-6 shadow-sm border rounded-lg">
          <div className="mb-6">
            <p className="text-center">
              These improvements come from key factors such as{" "}
              <span className="font-medium text-primary">
                Planning Accuracy, Flow Smoothing,
              </span>{" "}
              and{" "}
              <span className="font-medium text-primary">
                Priority Planning
              </span>
              . To see how each factor impacts your hospital's efficiency, enter
              your email below.
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-50"
              />
            </div>

            {!isOtpVisible && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={sendOTP}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Verify Email
                </Button>
              </div>
            )}

            {isOtpVisible && (
              <>
                <div>
                  <Label>Enter verification code sent to your email</Label>
                  <div className="flex justify-center gap-2 mt-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-lg"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={handleResendCode}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Resend Code
                  </Button>
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    onClick={verifyOTP}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Verify OTP
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  )
}
