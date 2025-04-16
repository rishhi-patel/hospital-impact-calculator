"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"

const SurgicalReport = dynamic(
  () => import("@/components/PDFReport/surgical-report"),
  { ssr: false }
)

function PDFRenderContent() {
  const searchParams = useSearchParams()
  const [departmentDetails, setDepartmentDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const encoded = searchParams.get("data")
    if (!encoded) return

    const loadEverything = async () => {
      try {
        const { decodePayload } = await import("@/lib/pdfUtils")
        const payload = decodePayload(encoded)

        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parameters: payload }),
        })

        const json = await res.json()
        setDepartmentDetails(json.data)
      } catch (err) {
        console.error("PDF render failed:", err)
      } finally {
        setLoading(false)
      }
    }

    loadEverything()
  }, [searchParams])

  if (loading) return <p className="p-6">Generating report...</p>
  if (!departmentDetails) return <p className="p-6">No data available.</p>

  return <SurgicalReport departmentDetails={departmentDetails} />
}

export default function PDFRenderPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <PDFRenderContent />
    </Suspense>
  )
}
