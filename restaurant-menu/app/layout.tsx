import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Playfair_Display, Lato } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "HAYAT RIVER Restaurant Menu",
  description: "Interactive tablet menu for HAYAT RIVER restaurant",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
