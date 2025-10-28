"use client"

import { useRef } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Feed } from "@/components/feed"
import type { AddNewPostFunction } from "@/components/feed"

export default function HomePage() {
  const feedRef = useRef<{ addNewPost: AddNewPostFunction } | null>(null)

  console.log("[v0] HomePage rendering with sidebar")

  return (
    <div className="min-h-screen bg-background">
      <Header
        onCreatePost={(title, content, song, theme) => feedRef.current?.addNewPost(title, content, song, theme)}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 max-w-2xl">
            <Feed ref={feedRef} />
          </main>

          {/* Right Sidebar - Hidden on mobile/tablet */}
          <div className="hidden xl:block w-80">
            <div className="space-y-4">
              {/* Trending Songs */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3 text-foreground">Trending Today</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Blinding Lights</p>
                      <p className="text-muted-foreground text-xs">The Weeknd</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Midnight City</p>
                      <p className="text-muted-foreground text-xs">M83</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Resonance</p>
                      <p className="text-muted-foreground text-xs">HOME</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Communities */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-3 text-foreground">Active Communities</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>r/synthwave</span>
                    <span className="text-muted-foreground">2.1k online</span>
                  </div>
                  <div className="flex justify-between">
                    <span>r/indierock</span>
                    <span className="text-muted-foreground">1.8k online</span>
                  </div>
                  <div className="flex justify-between">
                    <span>r/electronicmusic</span>
                    <span className="text-muted-foreground">3.2k online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
