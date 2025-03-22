import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { parameters } = await req.json()

  if (!parameters) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 })
  }

  try {
    const response = await fetch(
      "https://2bj3fa1bu2.execute-api.ca-central-1.amazonaws.com/Development/MagnetCalculatorBackend-Dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parameters }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.message || "Failed to fetch data from backend API"
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

export async function handler(req: NextRequest) {
  if (req.method === "POST") {
    return POST(req)
  } else {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
  }
}

export { handler as GET }
