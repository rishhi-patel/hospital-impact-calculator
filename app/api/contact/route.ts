import { NextRequest, NextResponse } from "next/server"
import puppeteerCore from "puppeteer-core"
import puppeteer from "puppeteer"
import chromium from "@sparticuz/chromium-min"
import FormData from "form-data"
import fetch from "node-fetch"
import { Readable } from "stream"

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, organizationName, encoded, source } =
      await req.json()

    if (!email || !encoded) {
      return NextResponse.json(
        { message: "Missing email or encoded data" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
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
    await page.goto(pdfPageUrl, { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#final-report", { timeout: 8000 })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    await browser.close()

    // Upload to HubSpot
    const form = new FormData()
    const stream = new Readable()
    stream.push(pdfBuffer)
    stream.push(null)

    form.append("file", stream, {
      filename: `${email}_report.pdf`,
      contentType: "application/pdf",
    })
    form.append("options", JSON.stringify({ access: "PUBLIC_INDEXABLE" }))
    form.append("folderPath", "/reports")

    const uploadResponse = await fetch(
      "https://api.hubapi.com/files/v3/files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          ...form.getHeaders(),
        },
        body: form,
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error("Upload failed: " + errorText)
    }

    const result = (await uploadResponse.json()) as { url?: string }
    const publicUrl = result.url || `${baseUrl}/pdf-render?data=${encoded}`

    // Search contact by email
    const searchResponse = await fetch(
      `https://api.hubapi.com/contacts/v1/search/query?q=${email}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json()
      throw new Error(
        (errorData as { message?: string }).message ||
          "Failed to search contact"
      )
    }

    const searchData = (await searchResponse.json()) as {
      total: number
      contacts: { vid: number }[]
    }
    const contactId = searchData.total > 0 ? searchData.contacts[0].vid : null

    const properties = [
      { property: "email", value: email },
      { property: "firstname", value: firstName },
      { property: "lastname", value: lastName },
      { property: "company", value: organizationName },
      { property: "contact_source", value: source },
      { property: "report_status", value: "Pending" },
      { property: "report_preview_link", value: publicUrl },
    ]

    const hubspotUrl = contactId
      ? `https://api.hubapi.com/contacts/v1/contact/vid/${contactId}/profile`
      : "https://api.hubapi.com/contacts/v1/contact"

    const hubspotMethod = contactId ? "POST" : "POST"
    const body = contactId ? { properties } : { properties }

    const saveContact = await fetch(hubspotUrl, {
      method: hubspotMethod,
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!saveContact.ok) {
      const errorData = await saveContact.json()
      throw new Error(
        (errorData as { message?: string }).message || "Failed to save contact"
      )
    }

    const savedContact =
      saveContact.status === 204 ? {} : await saveContact.json()

    return NextResponse.json({ success: true, savedContact }, { status: 200 })
  } catch (error: any) {
    console.error("web-to-pdf + hubspot error:", error)
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
