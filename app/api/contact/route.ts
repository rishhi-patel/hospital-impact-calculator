import { NextRequest, NextResponse } from "next/server"

// Fetch all contacts
export async function GET(req: NextRequest) {
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
        errorData.message || "Failed to fetch contacts from HubSpot"
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
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json(
      { message: "Missing email parameter" },
      { status: 400 }
    )
  }

  try {
    // Check if the contact exists in HubSpot using email (searching by email)
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
        errorData.message || "Failed to search contact in HubSpot"
      )
    }

    const searchData = await searchResponse.json()
    let contactId = null

    if (searchData.total > 0) {
      // If contact exists, update the contact (just updating name as an example)
      contactId = searchData.contacts[0].vid

      const updateResponse = await fetch(
        `https://api.hubapi.com/contacts/v1/contact/vid/${contactId}/profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: [
              {
                property: "email",
                value: email,
              },
            ],
          }),
        }
      )

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.message || "Failed to update contact")
      }

      const updatedContact = await updateResponse.json()
      return NextResponse.json(updatedContact, { status: 200 })
    } else {
      // If contact doesn't exist, create a new contact
      const createResponse = await fetch(
        "https://api.hubapi.com/contacts/v1/contact",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: [
              {
                property: "email",
                value: email,
              },
            ],
          }),
        }
      )

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.message || "Failed to create contact")
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
    return GET(req)
  } else {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
  }
}
