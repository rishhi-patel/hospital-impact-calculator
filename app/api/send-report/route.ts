import { sendDetailedReportEmail } from "@/lib/sendgrid"
import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(req: NextRequest) {
  try {
    const { encoded, email } = await req.json()

    if (!encoded || !email) {
      return NextResponse.json(
        { message: "Missing encoded data or email" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const pdfPageUrl = `${baseUrl}/pdf-render?data=${encoded}`

    // Check for the environment variable set by Netlify for the executable path
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      puppeteer.executablePath()

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath, // Use the executable path provided by the environment variable
    })

    const page = await browser.newPage()
    await page.goto(pdfPageUrl, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    await browser.close()

    const fileName = "SurgiTwin_Performance_Report.pdf"
    const mimeType = "application/pdf"

    // ✅ Send the email with the PDF buffer
    const success = await sendDetailedReportEmail(
      email,
      Buffer.from(pdfBuffer),
      fileName,
      mimeType
    )

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Email failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("send-report API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}