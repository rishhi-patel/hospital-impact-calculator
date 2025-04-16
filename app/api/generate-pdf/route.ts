import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer-core" // Use puppeteer-core
import chrome from "chrome-aws-lambda" // Use chrome-aws-lambda

export async function POST(req: NextRequest) {
  try {
    const { encoded } = await req.json()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const pdfPageUrl = `${baseUrl}/pdf-render?data=${encoded}`

    // Launch the browser using chrome-aws-lambda
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: await chrome.executablePath, // Use the executable path from chrome-aws-lambda
      args: chrome.args, // Use chrome-aws-lambda arguments
      defaultViewport: chrome.defaultViewport, // Default viewport size for Puppeteer
    })

    const page = await browser.newPage()
    await page.goto(pdfPageUrl, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
    })

    await browser.close()

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SurgiTwin_Performance_Report.pdf"`,
        "Access-Control-Allow-Origin": "*", // optional for iframe
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
