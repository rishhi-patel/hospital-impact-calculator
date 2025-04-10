// utils/pdfUtils.ts
import html2pdf from "html2pdf.js"

// Function to generate PDF from an HTML element
export const generatePDF = (elementId: string): void => {
  const element = document.getElementById(elementId) // Get the HTML element to convert

  if (!element) {
    console.error(`Element with id ${elementId} not found`)
    return
  }

  const options = {
    margin: 0, // Set to 0 for minimal margin
    filename: "SurgiTwin_Performance_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }
  // Generate the PDF from the HTML element
  if (typeof window !== "undefined") {
    html2pdf().from(element).set(options).save()
  } else {
    console.error("SSR is not supported for PDF generation")
  }
}

export const downloadPDF = async (encoded: string) => {
  const res = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encoded }),
  })

  if (!res.ok) {
    console.error("Failed to generate PDF")
    return
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "SurgiTwin_Performance_Report.pdf"
  a.click()
}

export const encodePayload = (obj: object) =>
  Buffer.from(JSON.stringify(obj)).toString("base64")

export const decodePayload = (encoded: string) =>
  JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"))
