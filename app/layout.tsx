import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Surgical Performance Estimator",
  description: "Calculate your surgical department's performance and compare it to industry benchmarks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/aeonik" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}



import './globals.css'