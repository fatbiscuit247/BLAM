"use client"

import { Music, Search, User, Menu, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreatePostDialog } from "./create-post-dialog"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import type { Song, MusicTheme } from "@/lib/types"

interface HeaderProps {
  onCreatePost?: (title: string, content: string, song: Song, theme?: MusicTheme) => void
  defaultTheme?: MusicTheme
}

export function Header({ onCreatePost, defaultTheme }: HeaderProps) {
  const user = getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            BLAM
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="ghost" size="sm">
              <Compass className="w-4 h-4 mr-2" />
              Discover
            </Button>
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search posts, songs, artists..." className="pl-10" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <CreatePostDialog onCreatePost={onCreatePost} defaultTheme={defaultTheme} />

          {user ? (
            <Link href={`/user/${user.username}`}>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
