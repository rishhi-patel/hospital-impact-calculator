"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download } from "lucide-react"
import { motion } from "framer-motion"

type PerformanceData = {
  totalBlocks: number
  potentialReduction: number
  projectedCases: number
  financialImpact: number
}

type DetailedReportProps = {
  data: PerformanceData
}

type Department = {
  id: string
  name: string
  isOpen: boolean
  caseVolume: {
    current: number
    optimized: number
    difference: number
  }
  blocksUsed: {
    current: number
    optimized: number
    difference: number
  }
  improvements: {
    category: string
    additionalCases: number
    freedUpBlocks: number
    savings: number
  }[]
  totalImpact: {
    additionalSurgeries: number
    freedUpBlocks: number
    costSavings: number
  }
}

export function DetailedReport({ data }: DetailedReportProps) {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "cardiac",
      name: "Cardiac Surgery Department",
      isOpen: true,
      caseVolume: {
        current: 1800,
        optimized: 1881,
        difference: 81,
      },
      blocksUsed: {
        current: 356,
        optimized: 341,
        difference: -15,
      },
      improvements: [
        {
          category: "Planning Accuracy",
          additionalCases: 11,
          freedUpBlocks: 2,
          savings: 32441,
        },
        {
          category: "Flow Smoothing",
          additionalCases: 15,
          freedUpBlocks: 3,
          savings: 42219,
        },
        {
          category: "Priority Planning",
          additionalCases: 55,
          freedUpBlocks: 11,
          savings: 159614,
        },
      ],
      totalImpact: {
        additionalSurgeries: 81,
        freedUpBlocks: 11,
        costSavings: 234274,
      },
    },
    {
      id: "general",
      name: "General Surgery Department",
      isOpen: false,
      caseVolume: {
        current: 2400,
        optimized: 2520,
        difference: 120,
      },
      blocksUsed: {
        current: 480,
        optimized: 456,
        difference: -24,
      },
      improvements: [
        {
          category: "Planning Accuracy",
          additionalCases: 25,
          freedUpBlocks: 5,
          savings: 62500,
        },
        {
          category: "Flow Smoothing",
          additionalCases: 35,
          freedUpBlocks: 7,
          savings: 87500,
        },
        {
          category: "Priority Planning",
          additionalCases: 60,
          freedUpBlocks: 12,
          savings: 150000,
        },
      ],
      totalImpact: {
        additionalSurgeries: 120,
        freedUpBlocks: 24,
        costSavings: 300000,
      },
    },
    {
      id: "neurosurgery",
      name: "Neurosurgery Department",
      isOpen: false,
      caseVolume: {
        current: 950,
        optimized: 1025,
        difference: 75,
      },
      blocksUsed: {
        current: 285,
        optimized: 266,
        difference: -19,
      },
      improvements: [
        {
          category: "Planning Accuracy",
          additionalCases: 15,
          freedUpBlocks: 4,
          savings: 75000,
        },
        {
          category: "Flow Smoothing",
          additionalCases: 25,
          freedUpBlocks: 6,
          savings: 125000,
        },
        {
          category: "Priority Planning",
          additionalCases: 35,
          freedUpBlocks: 9,
          savings: 175000,
        },
      ],
      totalImpact: {
        additionalSurgeries: 75,
        freedUpBlocks: 19,
        costSavings: 375000,
      },
    },
    {
      id: "ophthalmology",
      name: "Ophthalmology Surgery Department",
      isOpen: false,
      caseVolume: {
        current: 1200,
        optimized: 1260,
        difference: 60,
      },
      blocksUsed: {
        current: 180,
        optimized: 171,
        difference: -9,
      },
      improvements: [
        {
          category: "Planning Accuracy",
          additionalCases: 12,
          freedUpBlocks: 2,
          savings: 24000,
        },
        {
          category: "Flow Smoothing",
          additionalCases: 18,
          freedUpBlocks: 3,
          savings: 36000,
        },
        {
          category: "Priority Planning",
          additionalCases: 30,
          freedUpBlocks: 4,
          savings: 60000,
        },
      ],
      totalImpact: {
        additionalSurgeries: 60,
        freedUpBlocks: 9,
        costSavings: 120000,
      },
    },
    {
      id: "urology",
      name: "Urology Surgery Department",
      isOpen: false,
      caseVolume: {
        current: 850,
        optimized: 918,
        difference: 68,
      },
      blocksUsed: {
        current: 170,
        optimized: 156,
        difference: -14,
      },
      improvements: [
        {
          category: "Planning Accuracy",
          additionalCases: 14,
          freedUpBlocks: 3,
          savings: 35000,
        },
        {
          category: "Flow Smoothing",
          additionalCases: 22,
          freedUpBlocks: 4,
          savings: 55000,
        },
        {
          category: "Priority Planning",
          additionalCases: 32,
          freedUpBlocks: 7,
          savings: 80000,
        },
      ],
      totalImpact: {
        additionalSurgeries: 68,
        freedUpBlocks: 14,
        costSavings: 170000,
      },
    },
  ])

  const toggleDepartment = (id: string) => {
    setDepartments(departments.map((dept) => (dept.id === id ? { ...dept, isOpen: !dept.isOpen } : dept)))
  }

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

  const handleDownload = () => {
    // In a real app, you would generate and download a PDF report here
    alert("Report download functionality would be implemented here")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 shadow-sm border rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">SurgiTwin™ Performance Insights for Surgical Departments</h2>
          <p className="text-gray-600 mt-2">
            These improvements are driven by key factors such as Planning Accuracy, Flow Smoothing, and Priority
            Planning. See how each factor has impacted your department's efficiency based on your input.
          </p>
        </div>

        <div className="space-y-4">
          {departments.map((dept) => (
            <div key={dept.id} className="border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                onClick={() => toggleDepartment(dept.id)}
              >
                <h3 className="font-medium">{dept.name}</h3>
                {dept.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {dept.isOpen && (
                <div className="p-4">
                  <h4 className="font-medium mb-2">
                    Overall Performance Comparison Table (Before SurgiTwin vs. After SurgiTwin)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Metric</th>
                          <th className="p-2 text-right">Current Performance</th>
                          <th className="p-2 text-right">Optimized Performance</th>
                          <th className="p-2 text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">Case Volume</td>
                          <td className="p-2 text-right">{formatNumber(dept.caseVolume.current)}</td>
                          <td className="p-2 text-right">{formatNumber(dept.caseVolume.optimized)}</td>
                          <td className="p-2 text-right text-green-600">+{dept.caseVolume.difference} cases</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Estimated Blocks Used</td>
                          <td className="p-2 text-right">{dept.blocksUsed.current}</td>
                          <td className="p-2 text-right">{dept.blocksUsed.optimized}</td>
                          <td className="p-2 text-right text-green-600">{dept.blocksUsed.difference} blocks</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-medium mt-6 mb-2">Breakdown of Efficiency Improvements Table</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Category</th>
                          <th className="p-2 text-right">Additional Surgeries Performed</th>
                          <th className="p-2 text-right">Freed-Up Blocks</th>
                          <th className="p-2 text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {dept.improvements.map((improvement, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{improvement.category}</td>
                            <td className="p-2 text-right">+{improvement.additionalCases} Cases</td>
                            <td className="p-2 text-right">{improvement.freedUpBlocks} Blocks</td>
                            <td className="p-2 text-right text-green-600">
                              {formatCurrency(improvement.savings)} saved
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-teal-700">{dept.totalImpact.additionalSurgeries}</div>
                      <div className="text-sm text-teal-600">additional surgeries per year</div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-teal-700">{dept.totalImpact.freedUpBlocks}</div>
                      <div className="text-sm text-teal-600">freed-up surgery blocks</div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-teal-700">
                        {formatCurrency(dept.totalImpact.costSavings)}
                      </div>
                      <div className="text-sm text-teal-600">in cost savings</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            <Download size={16} />
            DOWNLOAD REPORT
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

