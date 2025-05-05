import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Markdown Blog",
  description: "A simple blog built with Next.js and Markdown",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <footer className="mt-20 py-8 border-t">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
            <p>© {new Date().getFullYear()} My Markdown Blog. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
