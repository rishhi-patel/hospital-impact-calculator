"use client"

import { useState } from "react"
import { SurgicalForm } from "@/components/surgical-form"
import { PerformanceImpact } from "@/components/performance-impact"
import { DetailedReport } from "@/components/detailed-report"
import { EmailVerification } from "@/components/email-verification"
import { AnimatePresence } from "framer-motion"

export default function SurgicalEstimator() {
  const [showResults, setShowResults] = useState(false)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [formData, setFormData] = useState({})
  const [performanceData, setPerformanceData] = useState({
    totalBlocks: 1631,
    potentialReduction: 97,
    projectedCases: 1034,
    financialImpact: 1777816,
  })

  const handleCalculate = (data: any) => {
    setFormData(data)
    // In a real app, you would calculate these values based on the form data
    setPerformanceData({
      totalBlocks: 1631,
      potentialReduction: 97,
      projectedCases: 1034,
      financialImpact: 1777816,
    })
    setShowResults(true)
    setShowEmailVerification(false)
    setShowDetailedReport(false)
  }

  const handleEmailSubmit = (email: string) => {
    setShowEmailVerification(true)
  }

  const handleVerificationSuccess = () => {
    setShowEmailVerification(false)
    setShowDetailedReport(true)
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Surgical Performance Estimator
        </h1>
        <p className="text-gray-600 mt-2">
          Provide details about your surgical department to calculate its
          performance and compare it to industry benchmarks.
        </p>
      </div>

      <div className="space-y-8">
        <SurgicalForm onCalculate={handleCalculate} />

        <AnimatePresence mode="wait">
          {showResults && !showDetailedReport && (
            <>
              <PerformanceImpact
                data={performanceData}
                onEmailSubmit={handleEmailSubmit}
              />
              <EmailVerification
                onVerificationSuccess={handleVerificationSuccess}
              />
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showDetailedReport && <DetailedReport data={performanceData} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
