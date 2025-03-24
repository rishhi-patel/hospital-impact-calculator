import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Hospital Impact Calculator",
  description: "Created by Sifio Health",
  generator: "Sifio Health",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
