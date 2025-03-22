"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"

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
  const [email, setEmail] = useState("")

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num)
  }

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
            Your Surgery Department's Performance Impact
          </h2>
          <p className="text-gray-600 mt-1">
            Based on your input, here's your hospital's estimated performance
            impact:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="bg-magnet-faint text-magnet p-4 rounded-lg mr-4">
              <div className="font-bold text-2xl">
                {formatNumber(data.totalBlocks)}
              </div>
              <div className="text-sm">blocks</div>
            </div>
            <div>
              <div className="font-medium">Total Surgical Blocks Estimate</div>
              <div className="text-sm text-gray-600">
                You have an estimated {formatNumber(data.totalBlocks)} blocks
                based on your services
              </div>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="bg-magnet-faint text-magnet p-4 rounded-lg mr-4">
              <div className="font-bold text-2xl">
                {data.potentialReduction}
              </div>
              <div className="text-sm">blocks</div>
            </div>
            <div>
              <div className="font-medium">Potential Block Reduction</div>
              <div className="text-sm text-gray-600">
                By improving efficiency, you could reduce this total by{" "}
                {data.potentialReduction} blocks.
              </div>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="bg-magnet-faint text-magnet p-4 rounded-lg mr-4">
              <div className="font-bold text-2xl">
                {formatNumber(data.projectedCases)}
              </div>
              <div className="text-sm">cases</div>
            </div>
            <div>
              <div className="font-medium">Projected Case Volume Increase</div>
              <div className="text-sm text-gray-600">
                You could perform an additional{" "}
                {formatNumber(data.projectedCases)} cases per year.
              </div>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="bg-magnet-faint text-magnet p-4 rounded-lg mr-4">
              <div className="font-bold text-2xl">
                {formatCurrency(data.financialImpact)}
              </div>
            </div>
            <div>
              <div className="font-medium">
                Financial Impact (Cost Savings or Revenue Increase)
              </div>
              <div className="text-sm text-gray-600">
                With improved performance, your potential $ impact is{" "}
                {formatCurrency(data.financialImpact)} per year.
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-8">
          <p className="text-center mb-4">
            These improvements come from key factors such as{" "}
            <span className="font-medium text-primary">Planning Accuracy, Flow Smoothing,</span> and{" "}
            <span className="font-medium text-primary">Priority Planning</span>. To see how each factor impacts your
            hospital's efficiency, enter your email below.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <Label htmlFor="email" className="block mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-blue-50"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Get Detailed Report
              </Button>
            </div>
          </form>
        </div> */}
      </Card>
    </motion.div>
  )
}
