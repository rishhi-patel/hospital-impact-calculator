// utils/pdfUtils.ts

import { jsPDF } from "jspdf"
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
  html2pdf().from(element).set(options).save()
}
