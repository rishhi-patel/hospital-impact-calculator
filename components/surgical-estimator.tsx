"use client"

import { useState } from "react"
import { SurgicalForm } from "@/components/surgical-form"
import { PerformanceImpact } from "@/components/performance-impact"
import { DetailedReport } from "@/components/detailed-report"
import { EmailVerification } from "@/components/email-verification"
import { AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function SurgicalEstimator() {
  const { toast } = useToast()
  const [showResults, setShowResults] = useState(false)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [performanceData, setPerformanceData] = useState({
    totalBlocks: 1631,
    potentialReduction: 97,
    projectedCases: 1034,
    financialImpact: 1777816,
    caseVolumeIncrease: 0,
    currentCases: 0,
  })

  interface Service {
    serviceName: string
    caseVolume: number
  }

  interface RequestBody {
    parameters: {
      hospitalType: string
      blockDuration: number
      costRate: number
      quartileInit: string
      quartileTarget: string
      services: Service[]
    }
  }

  const handleCalculate = async (data: RequestBody) => {
    console.log("hhshshsh")

    try {
      setShowResults(false)

      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("API request failed")

      const responseData = await response.json()
      const apiData = responseData.data

      const totalBlocks = Object.values(apiData).reduce(
        (sum: number, service: any) => sum + service.blocks,
        0
      )
      const potentialReduction = Object.values(apiData).reduce(
        (sum: number, service: any) =>
          sum + (service.blocks - service.potentialBlocks),
        0
      )
      const caseVolumeIncrease = Object.values(apiData).reduce(
        (sum: number, service: any) =>
          sum + (service.potentialCaseVolume - service.caseVolume),
        0
      )
      const financialImpact = Object.values(apiData).reduce(
        (sum: number, service: any) => sum + service.potentialCostSaved,
        0
      )
      const currentCases = Object.values(apiData).reduce(
        (sum: number, service: any) => sum + service.caseVolume,
        0
      )
      const projectedCases = Object.values(apiData).reduce(
        (sum: number, service: any) => sum + service.potentialCaseVolume,
        0
      )

      setPerformanceData({
        totalBlocks,
        potentialReduction,
        caseVolumeIncrease,
        financialImpact,
        currentCases,
        projectedCases,
      })

      setShowResults(true)
    } catch (error) {
      console.error("Error calling API:", error)
      toast({
        title: "Error",
        description: "There was a problem fetching the data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleVerificationSuccess = () => {
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
              <PerformanceImpact data={performanceData} />
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
