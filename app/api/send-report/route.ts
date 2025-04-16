import { sendDetailedReportEmail } from "@/lib/sendgrid"
import { NextRequest, NextResponse } from "next/server"
import chromium from "chrome-aws-lambda"
import puppeteer from "puppeteer-core"

export async function POST(req: NextRequest) {
  let browser = null

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

    const executablePath = await chromium.executablePath

    if (!executablePath) {
      console.error("Chromium executable path not found!")
      return NextResponse.json(
        { success: false, message: "Chromium executable path not found" },
        { status: 500 }
      )
    }

    // Launch Puppeteer with chrome-aws-lambda configuration
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    await page.goto(pdfPageUrl, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    })

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
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
}
