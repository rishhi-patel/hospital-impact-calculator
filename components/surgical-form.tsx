"use client"

import type React from "react"

import { useState } from "react"
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
  const [departmentType, setDepartmentType] = useState("")
  const [blockDuration, setBlockDuration] = useState("")
  const [currentPerformance, setCurrentPerformance] = useState("")
  const [comparisonLevel, setComparisonLevel] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const serviceCategories = [
    { id: "cardiac", name: "Cardiac" },
    { id: "general", name: "General" },
    { id: "gynaecologic", name: "Gynaecologic" },
    { id: "neurosurgery", name: "Neurosurgery" },
    { id: "ophthalmic", name: "Ophthalmic" },
    {
      id: "oral_and_maxillofacial_and_dentistry",
      name: "Oral and Maxillofacial and Dentistry",
    },
    { id: "orthopaedic", name: "Orthopaedic" },
    { id: "otolaryngic_ent", name: "Otolaryngic ENT" },
    { id: "plastic_and_reconstructive", name: "Plastic and Reconstructive" },
    { id: "urologic", name: "Urologic" },
    { id: "vascular", name: "Vascular" },
  ]
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    } else {
      setSelectedServices([...selectedServices, serviceId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const services: Service[] = selectedServices
      .map((serviceId) => {
        const service = serviceCategories.find((cat) => cat.id === serviceId)
        return service ? { serviceName: service.name, caseVolume: 1000 } : null
      })
      .filter((service): service is Service => service !== null)

    onCalculate({
      parameters: {
        hospitalType: departmentType,
        blockDuration: parseInt(blockDuration, 10),
        costRate: 40,
        quartileInit: currentPerformance,
        quartileTarget: comparisonLevel,
        services,
      },
    })
  }

  return (
    <Card className="p-6 shadow-sm border rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label htmlFor="department-type">
              What type of surgical department do you work in?
            </Label>
            <Select value={departmentType} onValueChange={setDepartmentType}>
              <SelectTrigger id="department-type" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="block-duration">
              What is the standard block duration in your surgical department?
            </Label>
            <Select value={blockDuration} onValueChange={setBlockDuration}>
              <SelectTrigger id="block-duration" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="240">240 minutes (4 hours)</SelectItem>
                <SelectItem value="480">480 minutes (8 hours)</SelectItem>
                <SelectItem value="720">720 minutes (12 hours)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
                          className="flex items-center gap-1 px-4 py-2 rounded-md bg-primary-light text-primary"
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
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                      onClick={() => toggleService(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="current-performance">
              How would you rate your department's current performance?
            </Label>
            <Select
              value={currentPerformance}
              onValueChange={setCurrentPerformance}
            >
              <SelectTrigger id="current-performance" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q3">Poor</SelectItem>
                <SelectItem value="Q2">Average</SelectItem>
                <SelectItem value="Q1">Good</SelectItem>
                <SelectItem value="Q0">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comparison-level">
              What level of performance would you like to compare your
              department to?
            </Label>
            <Select value={comparisonLevel} onValueChange={setComparisonLevel}>
              <SelectTrigger id="comparison-level" className="mt-2">
                <SelectValue placeholder="Input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q3">Poor</SelectItem>
                <SelectItem value="Q2">Average</SelectItem>
                <SelectItem value="Q1">Good</SelectItem>
                <SelectItem value="Q0">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8"
            >
              CALCULATE IMPACT
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
