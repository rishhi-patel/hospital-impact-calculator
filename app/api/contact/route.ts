import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"
import FormData from "form-data"
import fetch from "node-fetch"
import { Readable } from "stream"

// Fetch all contacts
export async function GET() {
  try {
    const response = await fetch(
      "https://api.hubapi.com/contacts/v1/lists/all/contacts/all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        (errorData as { message?: string }).message ||
          "Failed to fetch contacts from HubSpot"
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("API proxy error:", error)
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, organizationName, encoded, source } =
    await req.json()

  if (!email) {
    return NextResponse.json(
      { message: "Missing email parameter" },
      { status: 400 }
    )
  }

  try {
    // Check if the contact exists in HubSpot using email
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
          "Failed to search contact in HubSpot"
      )
    }

    const searchData = (await searchResponse.json()) as {
      total: number
      contacts: { vid: string }[]
    }
    let contactId = null

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const pdfPageUrl = `${baseUrl}/pdf-render?data=${encoded}`

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.goto(pdfPageUrl, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    await browser.close()

    // ✅ Upload to HubSpot using buffer
    const form = new FormData()
    const stream = new Readable()
    stream.push(pdfBuffer)
    stream.push(null)

    form.append("file", stream, {
      filename: `${email}_report.pdf`,
      contentType: "application/pdf",
    })
    form.append("options", JSON.stringify({ access: "PUBLIC_INDEXABLE" }))
    form.append("folderPath", "/reports") // optional; adjust as needed

    const uploadResponse = await fetch(
      "https://api.hubapi.com/files/v3/files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          ...form.getHeaders(), // IMPORTANT: sets correct multipart boundaries
        },
        body: form,
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      throw new Error("Upload failed: " + errorText)
    }

    const result = (await uploadResponse.json()) as {
      url?: string
      fileUrl?: string
    }
    console.log("✅ Uploaded file URL:", result.url || result.fileUrl)

    const publicUrl =
      result.url ||
      `${process.env.NEXT_PUBLIC_APP_URL}/pdf-render?data=${encoded}`

    const properties = [
      { property: "email", value: email },
      { property: "firstname", value: firstName },
      { property: "lastname", value: lastName },
      { property: "company", value: organizationName },
      { property: "contact_source", value: source },
      { property: "report_status", value: "Pending" },
      {
        property: "report_preview_link",
        value: publicUrl,
      },
    ]

    if (searchData.total > 0) {
      // Update existing contact
      contactId = searchData.contacts[0].vid

      const updateResponse = await fetch(
        `https://api.hubapi.com/contacts/v1/contact/vid/${contactId}/profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties }),
        }
      )

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(
          (errorData as { message?: string }).message ||
            "Failed to update contact"
        )
      }

      const updatedContact =
        updateResponse.status === 204 ? {} : await updateResponse.json()
      return NextResponse.json(updatedContact, { status: 200 })
    } else {
      // Create new contact
      const createResponse = await fetch(
        "https://api.hubapi.com/contacts/v1/contact",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties }),
        }
      )

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(
          (errorData as { message?: string }).message ||
            "Failed to create contact"
        )
      }

      const newContact = await createResponse.json()
      return NextResponse.json(newContact, { status: 200 })
    }
  } catch (error: any) {
    console.error("API proxy error:", error)
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function handler(req: NextRequest) {
  if (req.method === "POST") {
    return POST(req)
  } else if (req.method === "GET") {
    return GET()
  } else {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
  }
}
