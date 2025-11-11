import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PostsProvider } from "@/lib/posts-context"
import { AuthProvider } from "@/lib/auth-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "BLAM - Music Sharing Community",
  description: "Share and discover music with themed communities",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#a855f7",
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
          <AuthProvider>
            <PostsProvider>{children}</PostsProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
