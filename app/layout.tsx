import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PostsProvider } from "@/lib/posts-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "BLAM - Music Sharing Community",
  description: "Share and discover music with themed communities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <PostsProvider>{children}</PostsProvider>
        </Suspense>
      </body>
    </html>
  )
}
