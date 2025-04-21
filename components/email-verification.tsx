"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export function EmailVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpVisible, setIsOtpVisible] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      organizationName: Yup.string().required("Organization name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: () => sendOTP(),
  })

  useEffect(() => {
    if (isOtpVisible) {
      toast({
        title: "Verification code sent",
        description: "We've sent a 6-digit code to your email address.",
      })
    }
  }, [isOtpVisible, toast])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1)
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
    setOtp(pasted.split(""))
  }

  const sendOTP = async () => {
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formik.values.email }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to send OTP")

      setIsOtpVisible(true)
    } catch (error) {
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
        body: JSON.stringify({ email: formik.values.email, otp: otpValue }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to verify OTP")

      toast({
        title: "Verification successful",
        description: "Your email has been verified.",
      })
      setIsVerified(true)

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formik.values,
          source: "Surgical Calculator",
          encoded: localStorage.getItem("encoded"),
        }),
      })

      await fetch("https://puppeter-test-pearl.vercel.app/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formik.values.email,
          encoded: localStorage.getItem("encoded"),
        }),
      })
    } catch (error) {
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
            Thanks for verifying your email!
          </p>
          <p className="text-gray-700">
            Your report will be shared with you soon.
          </p>
        </Card>
      ) : (
        <Card className="p-6 shadow-sm border rounded-lg max-w-xl mx-auto">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  className="bg-blue-50"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  className="bg-blue-50"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={formik.values.organizationName}
                onChange={formik.handleChange}
                className="bg-blue-50"
              />
              {formik.touched.organizationName &&
                formik.errors.organizationName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.organizationName}
                  </p>
                )}
            </div>

            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="bg-blue-50"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {!isOtpVisible ? (
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Send OTP
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <Label>Enter the 6-digit code</Label>
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
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={verifyOTP}
                    className="bg-primary text-white px-6 py-2"
                  >
                    Verify OTP
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendOTP}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Resend Code
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>
      )}
    </motion.div>
  )
}
