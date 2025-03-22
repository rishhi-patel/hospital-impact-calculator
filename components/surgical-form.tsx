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
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  const formik = useFormik({
    initialValues: {
      departmentType: "Community",
      blockDuration: "440",
      currentPerformance: "Q2",
      comparisonLevel: "Q1",
      servicesError: "",
    },
    validationSchema: Yup.object({
      departmentType: Yup.string().required("Required"),
      blockDuration: Yup.string().required("Required"),
      currentPerformance: Yup.string().required("Required"),
      comparisonLevel: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      const services: Service[] = selectedServices
        .map((serviceId) => {
          const service = serviceCategories.find((cat) => cat.id === serviceId)
          return service
            ? { serviceName: service.name, caseVolume: 1000 }
            : null
        })
        .filter((service): service is Service => service !== null)

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
          costRate: 20,
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
        <div className="space-y-6">
          <div>
            <Label htmlFor="departmentType">
              What type of surgical department do you work in?
            </Label>
            <Select
              value={formik.values.departmentType}
              onValueChange={(value) =>
                formik.setFieldValue("departmentType", value)
              }
            >
              <SelectTrigger id="departmentType" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.departmentType && formik.errors.departmentType ? (
              <div className="text-red-500">{formik.errors.departmentType}</div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="blockDuration">
              What is the standard block duration in your surgical department?
            </Label>
            <Select
              value={formik.values.blockDuration}
              onValueChange={(value) =>
                formik.setFieldValue("blockDuration", value)
              }
            >
              <SelectTrigger id="blockDuration" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="240">240 minutes (4 hours)</SelectItem>
                <SelectItem value="480">480 minutes (8 hours)</SelectItem>
                <SelectItem value="720">720 minutes (12 hours)</SelectItem>
                <SelectItem value="440">440 minutes (Default)</SelectItem>
              </SelectContent>
            </Select>
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
                          className="flex items-center gap-1 px-4 py-2  bg-primary-light text-primary border border-gray-300 rounded-lg"
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
            </div>
            {formik.errors.servicesError ? (
              <div className="text-red-500">{formik.errors.servicesError}</div>
            ) : null}
          </div>

          <div>
            <Label htmlFor="currentPerformance">
              How would you rate your department's current performance?
            </Label>
            <Select
              value={formik.values.currentPerformance}
              onValueChange={(value) =>
                formik.setFieldValue("currentPerformance", value)
              }
            >
              <SelectTrigger id="currentPerformance" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q3">Poor</SelectItem>
                <SelectItem value="Q2">Average</SelectItem>
                <SelectItem value="Q1">Good</SelectItem>
                <SelectItem value="Q0">Excellent</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.currentPerformance &&
            formik.errors.currentPerformance ? (
              <div className="text-red-500">
                {formik.errors.currentPerformance}
              </div>
            ) : null}
          </div>

          <div>
            <Label htmlFor="comparisonLevel">
              What level of performance would you like to compare your
              department to?
            </Label>
            <Select
              value={formik.values.comparisonLevel}
              onValueChange={(value) =>
                formik.setFieldValue("comparisonLevel", value)
              }
            >
              <SelectTrigger id="comparisonLevel" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q3">Poor</SelectItem>
                <SelectItem value="Q2">Average</SelectItem>
                <SelectItem value="Q1">Good</SelectItem>
                <SelectItem value="Q0">Excellent</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.comparisonLevel && formik.errors.comparisonLevel ? (
              <div className="text-red-500">
                {formik.errors.comparisonLevel}
              </div>
            ) : null}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="text-magnet border-magnet hover:bg-magnet hover:border-magnet hover:text-white px-8"
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-magnet"
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
