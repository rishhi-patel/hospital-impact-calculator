"use client"

import type React from "react"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // Assuming you have an Input component

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

export function SurgicalForm({
  onCalculate,
}: {
  onCalculate: (data: RequestBody) => void
}) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [caseVolumes, setCaseVolumes] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)

  const serviceCategories = [
    { id: "cardiac", name: "Cardiac" },
    { id: "general", name: "General" },
    { id: "gynaecologic", name: "Gynaecologic" },
    { id: "neurosurgery", name: "Neurosurgery" },
    { id: "ophthalmic", name: "Ophthalmic" },
    { id: "orthopaedic", name: "Orthopaedic" },
    {
      id: "oral_and_maxillofacial_and_dentistry",
      name: "Oral and Maxillofacial and Dentistry",
    },
    { id: "otolaryngic_ent", name: "Otolaryngic ENT" },
    { id: "urologic", name: "Urologic" },
    { id: "vascular", name: "Vascular" },
    { id: "plastic_and_reconstructive", name: "Plastic and Reconstructive" },
  ]

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
      const newCaseVolumes = { ...caseVolumes }
      delete newCaseVolumes[serviceId]
      setCaseVolumes(newCaseVolumes)
    } else {
      setSelectedServices([...selectedServices, serviceId])
      setCaseVolumes({ ...caseVolumes, [serviceId]: 1000 })
    }
  }

  const handleCaseVolumeChange = (serviceId: string, volume: number) => {
    setCaseVolumes({ ...caseVolumes, [serviceId]: volume })
  }

  const formik = useFormik({
    initialValues: {
      departmentType: "Community",
      blockDuration: "440",
      costRate: "40",
      currentPerformance: "Q2",
      comparisonLevel: "Q1",
      servicesError: "",
    },
    validationSchema: Yup.object({
      departmentType: Yup.string().required("Required"),
      blockDuration: Yup.string().required("Required"),
      costRate: Yup.string().required("Required"),
      currentPerformance: Yup.string().required("Required"),
      comparisonLevel: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      const services: Service[] = selectedServices.map((id) => {
        const service = serviceCategories.find((s) => s.id === id)
        return {
          serviceName: service?.name ?? id,
          caseVolume: caseVolumes[id],
        }
      })

      if (services.length === 0) {
        formik.setFieldError(
          "servicesError",
          "Please select at least one service."
        )
        setLoading(false)
        return
      }

      await onCalculate({
        parameters: {
          hospitalType: values.departmentType,
          blockDuration: parseInt(values.blockDuration, 10),
          costRate: parseFloat(values.costRate),
          quartileInit: values.currentPerformance,
          quartileTarget: values.comparisonLevel,
          services,
        },
      })
      setLoading(false)
    },
  })

  return (
    <Card className="p-6 shadow-sm border rounded-lg">
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-8">
          {/* Question blocks */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Label className="font-semibold">
              What type of surgical department do you work in?
            </Label>
            <Select
              value={formik.values.departmentType}
              onValueChange={(value) =>
                formik.setFieldValue("departmentType", value)
              }
            >
              <SelectTrigger id="departmentType">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
              </SelectContent>
            </Select>{" "}
            {formik.touched.departmentType && formik.errors.departmentType ? (
              <div className="text-red-500">{formik.errors.departmentType}</div>
            ) : null}
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Label className="font-semibold">
              What is the standard block duration in your surgical department?
            </Label>
            <Select
              value={formik.values.blockDuration}
              onValueChange={(value) =>
                formik.setFieldValue("blockDuration", value)
              }
            >
              <SelectTrigger id="blockDuration">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="420">420 minutes (7 hours)</SelectItem>
                <SelectItem value="480">480 minutes (8 hours)</SelectItem>
                <SelectItem value="600">600 minutes (10 hours)</SelectItem>
              </SelectContent>
            </Select>{" "}
            {formik.touched.blockDuration && formik.errors.blockDuration ? (
              <div className="text-red-500">{formik.errors.blockDuration}</div>
            ) : null}
          </div>

          <div>
            <Label>
              Which surgical services does your department offer? (Select all
              that apply)
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 w-full">
                  {selectedServices.map((serviceId) => {
                    const service = serviceCategories.find(
                      (cat) => cat.id === serviceId
                    )
                    return (
                      service && (
                        <div
                          key={service.id}
                          className="flex items-center gap-1 px-4 py-2 bg-magnet-faint text-primary border border-gray-300 rounded-lg"
                          style={{ borderRadius: "8px !important" }}
                        >
                          {service.name}
                          <button
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className="ml-1"
                          >
                            <span className="text-primary">×</span>
                          </button>
                        </div>
                      )
                    )
                  })}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {serviceCategories
                  .filter((cat) => !selectedServices.includes(cat.id))
                  .map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 border border-gray-300"
                      style={{ borderRadius: "8px !important" }}
                      onClick={() => toggleService(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
              {formik.errors.servicesError ? (
                <div className="text-red-500">
                  {formik.errors.servicesError}
                </div>
              ) : null}
            </div>
          </div>

          {selectedServices.length > 0 && (
            <div className="mt-4">
              <div>
                {selectedServices.map((serviceId) => {
                  const service = serviceCategories.find(
                    (cat) => cat.id === serviceId
                  )
                  return (
                    service && (
                      <div className="grid md:grid-cols-2 gap-6 items-start">
                        <Label className="font-semibold">
                          {service.name} Case Volume
                        </Label>
                        <Input
                          type="number"
                          value={caseVolumes[service.id]}
                          onChange={(e) =>
                            handleCaseVolumeChange(
                              service.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          placeholder="Case Volume"
                          className="mt-2"
                        />
                      </div>
                    )
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Label className="font-semibold">
              What is your department’s estimated hourly cost/revenue rate?
            </Label>
            <Select
              value={formik.values.costRate}
              onValueChange={(value) => formik.setFieldValue("costRate", value)}
            >
              <SelectTrigger id="costRate">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">$20/hr</SelectItem>
                <SelectItem value="40">$40/hr</SelectItem>
                <SelectItem value="60">$60/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Label className="font-semibold">
              How would you rate your department’s current performance?
            </Label>
            <Select
              value={formik.values.currentPerformance}
              onValueChange={(value) =>
                formik.setFieldValue("currentPerformance", value)
              }
            >
              <SelectTrigger id="currentPerformance">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q3">Poor</SelectItem>
                <SelectItem value="Q2">Average</SelectItem>
                <SelectItem value="Q1">Good</SelectItem>
                <SelectItem value="Best">Excellent</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.currentPerformance &&
            formik.errors.currentPerformance ? (
              <div className="text-red-500">
                {formik.errors.currentPerformance}
              </div>
            ) : null}
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <Label className="font-semibold">
              What level of performance would you like to compare your
              department to?
            </Label>
            <Select
              value={formik.values.comparisonLevel}
              onValueChange={(value) =>
                formik.setFieldValue("comparisonLevel", value)
              }
            >
              <SelectTrigger id="comparisonLevel">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q3">Poor</SelectItem>
                <SelectItem value="Q2">Average</SelectItem>
                <SelectItem value="Q1">Good</SelectItem>
                <SelectItem value="Best">Excellent</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.comparisonLevel && formik.errors.comparisonLevel ? (
              <div className="text-red-500">
                {formik.errors.comparisonLevel}
              </div>
            ) : null}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="text-magnet border-magnet hover:bg-magnet hover:text-white px-8"
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-magnet"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <strong>Loading...</strong>
                </div>
              ) : (
                <strong>CALCULATE IMPACT</strong>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
