/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// amplify/backend/function/webToPdfHubspot/src/index.js

const puppeteerCore = require("puppeteer-core")
const puppeteer = require("puppeteer")
const chromium = require("@sparticuz/chromium-min")
const FormData = require("form-data")
const fetch = require("node-fetch")
const { Readable } = require("stream")

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"

exports.handler = async (event) => {
  try {
    const { email, firstName, lastName, organizationName, encoded, source } =
      JSON.parse(event.body || "{}")

    if (!email || !encoded) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Missing email or encoded data" }),
      }
    }

    // your frontend URL, set via env var in amplify update function
    const baseUrl = process.env.APP_URL || "http://localhost:3000"
    const pdfPageUrl = `${baseUrl}/pdf-render?data=${encoded}`

    // decide which Puppeteer to launch
    const browser = await (process.env.NODE_ENV === "production"
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

    // ——— Upload to HubSpot ———
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

    const { url: publicUrl = pdfPageUrl } = await uploadResponse.json()

    // ——— Search or Create Contact ———
    const searchRes = await fetch(
      `https://api.hubapi.com/contacts/v1/search/query?q=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    if (!searchRes.ok) {
      const err = await searchRes.json()
      throw new Error(err.message || "Failed to search contact")
    }

    const { total, contacts } = await searchRes.json()
    const contactId = total > 0 ? contacts[0].vid : null

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
    const hubspotRes = await fetch(hubspotUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    })
    if (!hubspotRes.ok) {
      const err = await hubspotRes.json()
      throw new Error(err.message || "Failed to save contact")
    }
    const savedContact =
      hubspotRes.status === 204 ? {} : await hubspotRes.json()

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, savedContact }),
    }
  } catch (error) {
    console.error("Lambda error:", error)
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message || "Internal Server Error",
      }),
    }
  }
}
