import { sendDetailedReportEmail } from "@/lib/sendgrid"
import { NextRequest, NextResponse } from "next/server"
import puppeteerCore from "puppeteer-core"
import puppeteer from "puppeteer"
import chromium from "@sparticuz/chromium-min"

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"

export async function POST(req: NextRequest) {
  try {
    const { encoded, email } = await req.json()

    if (!encoded || !email) {
      return NextResponse.json(
        { message: "Missing encoded data or email" },
        { status: 400 }
      )
    }

    const baseUrl = "http://localhost:3000"
    const pdfPageUrl = `${baseUrl}/pdf-render?data=${encoded}`

    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production"

    const browser = await (isProd
      ? puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(remoteExecutablePath),
          headless: chromium.headless,
        })
      : puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          headless: true,
        }))

    const page = await browser.newPage()
    await page.goto(pdfPageUrl, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    await browser.close()

    const fileName = "SurgiTwin_Performance_Report.pdf"
    const mimeType = "application/pdf"

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
      { success: false, message: "Internal error" },
      { status: 500 }
    )
  }
}
