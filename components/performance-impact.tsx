"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

type PerformanceData = {
  totalBlocks: number
  potentialReduction: number
  projectedCases: number
  financialImpact: number
}

type PerformanceImpactProps = {
  data: PerformanceData
}

export function PerformanceImpact({ data }: PerformanceImpactProps) {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num)

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num)

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
            Based on your input, here’s your hospital’s estimated performance
            impact:
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Total Surgical Blocks */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-transparent">
            <div className="flex items-center justify-center bg-[#2C615017] text-[#2C6150] px-4 py-2 rounded-lg mr-4 min-w-[25%]">
              <div className="font-bold text-2xl mr-[5px]">
                {formatNumber(data.totalBlocks)}
              </div>
              <div className="text-sm"> blocks</div>
            </div>
            <div>
              <div className="font-semibold">
                Total Surgical Blocks Estimate
              </div>
              <div className="text-sm text-gray-600">
                You have an estimated {formatNumber(data.totalBlocks)} blocks
                based on your services
              </div>
            </div>
          </div>

          {/* Potential Block Reduction */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-transparent">
            <div className="flex  items-center justify-center bg-[#2C615017] text-[#2C6150] px-4 py-2 rounded-lg mr-4  min-w-[25%]">
              <div className="font-bold text-2xl mr-[5px]">
                {formatNumber(data.potentialReduction)}
                {"  "}
              </div>
              <div className="text-sm">blocks</div>
            </div>
            <div>
              <div className="font-semibold">Potential Block Reduction</div>
              <div className="text-sm text-gray-600">
                By improving efficiency, you could reduce this total by{" "}
                {formatNumber(data.potentialReduction)} blocks.
              </div>
            </div>
          </div>

          {/* Projected Case Volume Increase */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-transparent">
            <div className="flex  items-center justify-center bg-[#2C615017] text-[#2C6150] px-4 py-2 rounded-lg mr-4  min-w-[25%]">
              <div className="font-bold text-2xl mr-[5px]">
                {formatNumber(data.projectedCases)}
                {"  "}
              </div>
              <div className="text-sm">cases</div>
            </div>
            <div>
              <div className="font-semibold">
                Projected Case Volume Increase
              </div>
              <div className="text-sm text-gray-600">
                You could perform an additional{" "}
                {formatNumber(data.projectedCases)} cases per year.
              </div>
            </div>
          </div>

          {/* Financial Impact */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-transparent">
            <div className="flex  items-center justify-center bg-[#2C615017] text-[#2C6150] px-4 py-2 rounded-lg mr-4  min-w-[25%]">
              <div className="font-bold text-2xl">
                {formatCurrency(data.financialImpact)}
              </div>
            </div>
            <div>
              <div className="font-semibold">
                Financial Impact (Cost Savings or Revenue Increase)
              </div>
              <div className="text-sm text-gray-600">
                With improved performance, your potential $ impact is{" "}
                {formatCurrency(data.financialImpact)} per year.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
