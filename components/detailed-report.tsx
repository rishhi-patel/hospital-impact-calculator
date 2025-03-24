"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download } from "lucide-react"
import { motion } from "framer-motion"
import Chip from "./ui/Chip"
import { generatePDF, generatePDFBlob } from "../lib/pdfUtils"
import { sendEmailWithPDFBlob } from "@/lib/sendgrid"

interface DepartmentDetail {
  serviceName: string
  caseVolume: number
  potentialCaseVolume: number
  blocks: number
  potentialBlocks: number
  potentialCostSaved: number
  potentialByBucket: {
    bucketName: string
    volumeIncreased: number
    blocksReduced: number
    costSaved: number
  }[]
}

type DetailedReportProps = {
  departmentDetails: Record<string, DepartmentDetail>
}

export function DetailedReport({ departmentDetails }: DetailedReportProps) {
  const [openDepartments, setOpenDepartments] = useState<string[]>([])

  const toggleDepartment = (id: string) => {
    setOpenDepartments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
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
    // Generate PDF from the element with the given ID
    generatePDF("pdf-report")
  }

  // useEffect(() => {
  //   const sendEmail = async () => {
  //     const email = "rishhi.dev@gmail.com" // Replace with the actual email
  //     const pdfBlob = await generatePDFBlob()
  //     await sendEmailWithPDFBlob(email, pdfBlob)
  //   }
  //   sendEmail()
  // }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-sm border rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            SurgiTwin™ Performance Insights for Surgical Departments
          </h2>
          <p className="text-gray-600 mt-2">
            These improvements are driven by key factors such as Planning
            Accuracy, Flow Smoothing, and Priority Planning. See how each factor
            has impacted your department's efficiency based on your input.
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(departmentDetails).map(([name, dept]) => {
            const isOpen = openDepartments.includes(name)
            const caseDiff = dept.potentialCaseVolume - dept.caseVolume
            const blockDiff = dept.potentialBlocks - dept.blocks

            return (
              <div key={name} className="border rounded-lg overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                  onClick={() => toggleDepartment(name)}
                >
                  <h3 className="font-medium">{name} Department</h3>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                {isOpen && (
                  <div className="p-4">
                    <h4 className="font-medium mb-2">
                      Overall Performance Comparison Table (Before SurgiTwin vs.
                      After SurgiTwin)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 text-left">Metric</th>
                            <th className="p-2 text-right">
                              Current Performance
                            </th>
                            <th className="p-2 text-right">
                              Optimized Performance
                            </th>
                            <th className="p-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-2">Case Volume</td>
                            <td className="p-2 text-right">
                              {formatNumber(dept.caseVolume)}
                            </td>
                            <td className="p-2 text-right">
                              {formatNumber(dept.potentialCaseVolume)}
                            </td>
                            <td className="p-2 text-right text-green-600">
                              <Chip
                                value={formatNumber(caseDiff)}
                                helperText="cases"
                              />{" "}
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-2">Estimated Blocks Used</td>
                            <td className="p-2 text-right">
                              {formatNumber(dept.blocks)}
                            </td>
                            <td className="p-2 text-right">
                              {formatNumber(dept.potentialBlocks)}
                            </td>
                            <td className="p-2 text-right text-green-600">
                              <Chip
                                value={formatNumber(blockDiff)}
                                helperText="blocks"
                              />{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 className="font-medium mt-6 mb-2">
                      Breakdown of Efficiency Improvements Table
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 text-left">Category</th>
                            <th className="p-2 text-right">
                              Additional Surgeries Performed
                            </th>
                            <th className="p-2 text-right">Freed-Up Blocks</th>
                            <th className="p-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {dept.potentialByBucket.map((improve, i) => (
                            <tr key={i} className="border-t">
                              <td className="p-2">{improve.bucketName}</td>
                              <td className="p-2 text-right">
                                +{formatNumber(improve.volumeIncreased)} Cases
                              </td>
                              <td className="p-2 text-right">
                                {formatNumber(improve.blocksReduced)} Blocks
                              </td>
                              <td className="p-2 text-right text-green-600">
                                <Chip
                                  value={formatCurrency(
                                    Math.abs(improve.costSaved)
                                  )}
                                  helperText="saved"
                                />{" "}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                      <div className="bg-magnet-faint p-4 rounded-lg">
                        <div className="text-3xl font-bold text-magnet">
                          {formatNumber(caseDiff)}
                        </div>
                        <div className="text-sm text-magnet">
                          additional surgeries per year
                        </div>
                      </div>
                      <div className="bg-magnet-faint p-4 rounded-lg">
                        <div className="text-3xl font-bold text-magnet">
                          {formatNumber(-blockDiff)}
                        </div>
                        <div className="text-sm text-magnet">
                          freed-up surgery blocks
                        </div>
                      </div>
                      <div className="bg-magnet-faint p-4 rounded-lg">
                        <div className="text-3xl font-bold text-magnet">
                          {formatCurrency(dept.potentialCostSaved)}
                        </div>
                        <div className="text-sm text-magnet">
                          in cost savings
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
