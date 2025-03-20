"use client"

import { useState, useRef, useEffect } from "react"
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OTPInput } from "@/components/otp-input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define types for our form data
type SurgicalService = {
  id: string
  name: string
}

type FormData = {
  departmentType: string
  blockDuration: string
  services: SurgicalService[]
  currentPerformance: string
  targetPerformance: string
}

// Define types for our calculation results
type CalculationResults = {
  totalBlocks: number
  potentialReduction: number
  caseVolumeIncrease: number
  financialImpact: number
  currentCases: number
  projectedCases: number
}

// Define verification states
type VerificationState = "idle" | "sending" | "sent" | "verifying" | "verified" | "error"

export default function SurgicalPerformanceEstimator() {
  // Move the ref inside the component function
  const resultsRef = useRef<HTMLDivElement>(null)

  // Available surgical services
  const availableServices: SurgicalService[] = [
    { id: "general", name: "General" },
    { id: "cardiac", name: "Cardiac" },
    { id: "gynecology", name: "Gynecology" },
    { id: "neurosurgery", name: "Neurosurgery" },
    { id: "ophthalmology", name: "Ophthalmology" },
    { id: "orthopaedics", name: "Orthopaedics" },
    { id: "urology", name: "Urology" },
    { id: "service1", name: "Service Name" },
    { id: "service2", name: "Service Name" },
    { id: "service3", name: "Service Name" },
    { id: "service4", name: "Service Name" },
    { id: "service5", name: "Service Name" },
  ]

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    departmentType: "",
    blockDuration: "",
    services: [
      { id: "general", name: "General" },
      { id: "cardiac", name: "Cardiac" },
      { id: "gynecology", name: "Gynecology" },
      { id: "neurosurgery", name: "Neurosurgery" },
    ],
    currentPerformance: "",
    targetPerformance: "",
  })

  // State for calculation results
  const [results, setResults] = useState<CalculationResults | null>(null)

  // State for dialog visibility
  const [showResults, setShowResults] = useState(false)

  // State for email input
  const [email, setEmail] = useState("")

  // State for verification
  const [verificationState, setVerificationState] = useState<VerificationState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [otp, setOtp] = useState("")

  // Effect to scroll to results when they appear
  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [showResults])

  // Handle service selection/deselection
  const toggleService = (service: SurgicalService) => {
    if (formData.services.some((s) => s.id === service.id)) {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s.id !== service.id),
      })
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, service],
      })
    }
  }

  // Calculate results based on form data
  const calculateResults = () => {
    // This would normally be a more complex calculation based on real data
    // For demo purposes, we'll use some simple calculations
    const totalBlocks = 1631
    const potentialReduction = 97
    const currentCases = 11600
    const projectedCases = 12634
    const caseVolumeIncrease = 1034
    const financialImpact = 1777816

    setResults({
      totalBlocks,
      potentialReduction,
      caseVolumeIncrease,
      financialImpact,
      currentCases,
      projectedCases,
    })

    setShowResults(true)
  }

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Send OTP to email
  const sendOTP = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address")
      setVerificationState("error")
      return
    }

    try {
      setVerificationState("sending")
      setErrorMessage("")

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code")
      }

      setVerificationState("sent")
    } catch (error) {
      console.error("Error sending OTP:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to send verification code")
      setVerificationState("error")
    }
  }

  // Verify OTP
  const verifyOTP = async (otpValue: string) => {
    try {
      setVerificationState("verifying")
      setErrorMessage("")

      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify code")
      }

      setVerificationState("verified")
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to verify code")
      setVerificationState("error")
    }
  }

  // Handle OTP completion
  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue)
    verifyOTP(otpValue)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-aeonik">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Surgical Performance Estimator</h1>
        <p className="mt-2 text-foreground">
          Provide details about your surgical department to calculate its performance and compare it to industry
          benchmarks.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-4">
          <div>
            <Label htmlFor="departmentType" className="mb-2 block font-medium">
              What type of surgical department do you work in?
            </Label>
            <Select
              value={formData.departmentType}
              onValueChange={(value) => setFormData({ ...formData, departmentType: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Surgery</SelectItem>
                <SelectItem value="cardiac">Cardiac Surgery</SelectItem>
                <SelectItem value="orthopedic">Orthopedic Surgery</SelectItem>
                <SelectItem value="neuro">Neurosurgery</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="blockDuration" className="mb-2 block font-medium">
              What is the standard block duration in your surgical department?
            </Label>
            <Select
              value={formData.blockDuration}
              onValueChange={(value) => setFormData({ ...formData, blockDuration: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="10">10 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block font-medium">
              Which surgical services does your department offer?{" "}
              <span className="text-sm text-muted-foreground">(Select all that apply)</span>
            </Label>
            <div className="mb-2 flex flex-wrap gap-2">
              {formData.services.map((service) => (
                <div key={service.id} className="flex items-center rounded-md bg-theme-tag-bg px-3 py-1 text-sm">
                  <span>{service.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleService(service)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableServices
                .filter((service) => !formData.services.some((s) => s.id === service.id))
                .map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service)}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    {service.name}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <Label htmlFor="currentPerformance" className="mb-2 block font-medium">
              How would you rate your department&apos;s current performance?
            </Label>
            <Select
              value={formData.currentPerformance}
              onValueChange={(value) => setFormData({ ...formData, currentPerformance: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetPerformance" className="mb-2 block font-medium">
              What level of performance would you like to compare your department to?
            </Label>
            <Select
              value={formData.targetPerformance}
              onValueChange={(value) => setFormData({ ...formData, targetPerformance: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="industry">Industry Average</SelectItem>
                <SelectItem value="top25">Top 25%</SelectItem>
                <SelectItem value="top10">Top 10%</SelectItem>
                <SelectItem value="best">Best in Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={calculateResults}
            className="border-theme-dark bg-white text-theme-dark hover:bg-gray-50"
            variant="outline"
          >
            CALCULATE IMPACT
          </Button>
        </div>
      </div>

      {/* Results Section with Animation */}
      {results && (
        <div
          ref={resultsRef}
          className={`mt-8 rounded-lg border bg-white p-6 shadow-sm transition-all duration-500 ${
            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Surgery Department&apos;s Performance Impact</h2>
            <p className="text-foreground mt-2">
              Based on your input, here&apos;s your hospital&apos;s estimated performance impact:
            </p>
          </div>

          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-48 items-center rounded-lg bg-theme-metric-bg pl-4">
                <div>
                  <div className="text-3xl font-bold text-theme-metric-text">{formatNumber(results.totalBlocks)}</div>
                  <div className="text-sm text-gray-500">blocks</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Total Surgical Blocks Estimate</h3>
                <p className="text-gray-600">
                  You have an estimated {formatNumber(results.totalBlocks)} blocks based on your services
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-24 w-48 items-center rounded-lg bg-theme-metric-bg pl-4">
                <div>
                  <div className="text-3xl font-bold text-theme-metric-text">
                    {formatNumber(results.potentialReduction)}
                  </div>
                  <div className="text-sm text-gray-500">blocks</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Potential Block Reduction</h3>
                <p className="text-gray-600">
                  By improving efficiency, you could reduce this total by {formatNumber(results.potentialReduction)}{" "}
                  blocks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-24 w-48 items-center rounded-lg bg-theme-metric-bg pl-4">
                <div>
                  <div className="text-3xl font-bold text-theme-metric-text">
                    {formatNumber(results.caseVolumeIncrease)}
                  </div>
                  <div className="text-sm text-gray-500">cases</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Projected Case Volume Increase</h3>
                <p className="text-gray-600">
                  You could perform an additional {formatNumber(results.caseVolumeIncrease)} cases per year, moving from{" "}
                  {formatNumber(results.currentCases)} to {formatNumber(results.projectedCases)} cases.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-24 w-48 items-center rounded-lg bg-theme-metric-bg pl-4">
                <div>
                  <div className="text-3xl font-bold text-theme-metric-text">
                    ${formatNumber(results.financialImpact)}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Financial Impact (Cost Savings or Revenue Increase)</h3>
                <p className="text-gray-600">
                  With improved performance, your potential $ impact is ${formatNumber(results.financialImpact)} per
                  year.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="mb-4">
                These improvements come from key factors such as{" "}
                <span className="font-semibold text-theme-dark">Planning Accuracy</span>,{" "}
                <span className="font-semibold text-theme-dark">Flow Smoothing</span>, and{" "}
                <span className="font-semibold text-theme-dark">Priority Planning</span>. To see how each factor impacts
                your hospital&apos;s efficiency, enter your email below.
              </p>

              <div className="mx-auto mt-4 max-w-md">
                {verificationState === "verified" ? (
                  <div className="rounded-md bg-green-50 p-4 text-green-800">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          Email verified successfully! We'll send you detailed information about how each factor impacts
                          your hospital's efficiency.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="mb-2 block text-left">
                        Email
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={
                            verificationState === "sending" ||
                            verificationState === "sent" ||
                            verificationState === "verifying"
                          }
                        />
                        {verificationState === "idle" || verificationState === "error" ? (
                          <Button
                            onClick={sendOTP}
                            className="whitespace-nowrap border-theme-dark bg-white text-theme-dark hover:bg-gray-50"
                            variant="outline"
                          >
                            Send Code
                          </Button>
                        ) : verificationState === "sending" ? (
                          <Button disabled className="whitespace-nowrap">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending
                          </Button>
                        ) : (
                          <Button
                            onClick={sendOTP}
                            className="whitespace-nowrap border-theme-dark bg-white text-theme-dark hover:bg-gray-50"
                            variant="outline"
                          >
                            Resend Code
                          </Button>
                        )}
                      </div>
                    </div>

                    {verificationState === "error" && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                    {(verificationState === "sent" || verificationState === "verifying") && (
                      <div className="space-y-2">
                        <Label className="block text-left">Enter verification code sent to your email</Label>
                        <OTPInput onComplete={handleOTPComplete} />
                        {verificationState === "verifying" && (
                          <div className="flex items-center justify-center mt-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">Verifying...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

