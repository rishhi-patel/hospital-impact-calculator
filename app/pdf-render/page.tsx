"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import SurgicalReport from "@/components/surgical-report"
import { decodePayload } from "@/lib/pdfUtils"

export default function PDFRenderPage() {
  const searchParams = useSearchParams()
  const [departmentDetails, setDepartmentDetails] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const encoded = searchParams.get("data")
    if (!encoded) {
      if (typeof window === "undefined") return

      const encoded = searchParams?.get("data")
      return
    }

    const payload = decodePayload(encoded)

    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parameters: payload }),
    })
      .then((res) => res.json())
      .then((res) => {
        const apiData = res.data

        setDepartmentDetails(apiData)
      })
      .catch((err) => console.error("Failed to calculate in PDF render", err))
      .finally(() => setLoading(false))
  }, [searchParams])

  if (loading) return <p className="p-6">Generating report...</p>

  if (!departmentDetails) return <p className="p-6">No data available.</p>

  return <SurgicalReport departmentDetails={departmentDetails} />
}
