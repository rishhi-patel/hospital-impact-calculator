"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { EmailVerification } from "./email-verification"

type PerformanceData = {
  totalBlocks: number
  potentialReduction: number
  projectedCases: number
  financialImpact: number
  currentCases?: number
}

type PerformanceImpactProps = Readonly<{
  data: PerformanceData
}>

export function PerformanceImpact({ data }: PerformanceImpactProps) {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num)

  const formatRoundedNumber = (num: number): number => {
    return Math.round(num / 100) * 100
  }

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num)

  const formatRoundedCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(num / 100) * 100)

  const InfoBox = ({
    value,
    unit,
    title,
    subtitle,
    isCurrency = false,
  }: {
    value: number
    unit?: string
    title: string
    subtitle: string
    isCurrency?: boolean
  }) => (
    <div
      className="flex items-center p-4 rounded-lg border border-transparent"
      style={{ borderBottom: "1px solid #B5CBBF38" }}
    >
      <div
        className="flex items-center justify-center bg-[#2C615017] text-[#2C6150] px-4 py-4 rounded-lg mr-4 min-w-[25%]"
        style={{
          borderRadius: "22px",
          boxShadow: "0px 4px 4px 0px #2C615017",
        }}
      >
        <span className="text-3xl font-bold leading-tight">
          {isCurrency ? formatRoundedCurrency(value) : formatNumber(value)}
        </span>
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
      <div>
        <h3 className="font-semibold text-base text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>
    </div>
  )

  const projectedSubtitle = data.currentCases
    ? `Efficiency gains could enable your department to perform an additional ${formatNumber(
        data.projectedCases - data.currentCases
      )} cases annually, increasing total volume from ${formatNumber(
        data.currentCases
      )} to ${formatNumber(data.projectedCases)} cases.`
    : `Efficiency gains could enable your department to perform an additional ${formatNumber(
        data.projectedCases
      )} cases annually.`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-sm border rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Surgery Department’s Performance Impact
          </h2>
          <p className="text-gray-600 mt-1">
            Based on the information provided, here is the estimated performance
            impact for your surgical department:
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <InfoBox
            value={formatRoundedNumber(data.totalBlocks)}
            unit="blocks"
            title="Total Surgical Blocks Estimate"
            subtitle={`Your department is estimated to require ${formatRoundedNumber(
              data.totalBlocks
            )} surgical blocks annually based on current services and case volume.`}
          />
          <InfoBox
            value={data.potentialReduction}
            unit="blocks"
            title="Potential Block Reduction"
            subtitle={`Improved efficiency could reduce block usage by approximately ${formatNumber(
              data.potentialReduction
            )} blocks per year, freeing up valuable OR time.`}
          />
          <InfoBox
            value={data.projectedCases - (data.currentCases ?? 0)}
            unit="cases"
            title="Projected Case Volume Increase"
            subtitle={projectedSubtitle}
          />
          <InfoBox
            value={data.financialImpact}
            title="Financial Impact (Cost Savings or Revenue Increase)"
            subtitle={`Enhanced performance could generate an estimated ${formatRoundedCurrency(
              data.financialImpact
            )} in annual financial impact, through cost savings or increased surgical revenue.`}
            isCurrency
          />
        </div>

        <EmailVerification />
      </Card>
    </motion.div>
  )
}
