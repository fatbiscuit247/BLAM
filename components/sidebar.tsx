"use client"

import { Home, TrendingUp, Music, Users, Headphones, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { communities } from "@/lib/communities"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import { CreateCommunityDialog } from "./create-community-dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", href: "/", active: true },
  { icon: TrendingUp, label: "Trending", href: "/trending", active: false },
  { icon: Music, label: "Genres", href: "/genres", active: false },
  { icon: Users, label: "Communities", href: "/communities", active: false },
  { icon: Headphones, label: "My Music", href: "/my-music", active: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const { customCommunities } = usePosts()
  const { isMemberOf, isAuthenticated } = useAuth()

  return (
    <aside className="w-64 space-y-4">
      {/* Navigation */}
      <Card className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </Card>

      {/* Communities */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-foreground">Music Communities</h3>
        </div>
        <div className="space-y-1">
          {communities.map((community) => {
            const isActive = pathname === `/community/${community.id}`
            const isMember = isAuthenticated && isMemberOf(community.id)
            return (
              <Button
                key={community.id}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs h-9 relative"
                asChild
              >
                <Link href={`/community/${community.id}`}>
                  <span className="mr-2 text-base">{community.icon}</span>
                  <span className="flex-1 text-left">{community.name}</span>
                  {isMember && <Check className="w-3 h-3 text-green-500 mr-1" />}
                  <span className="text-muted-foreground text-[10px]">
                    {(community.memberCount / 1000).toFixed(1)}k
                  </span>
                </Link>
              </Button>
            )
          })}

          {customCommunities.length > 0 && (
            <>
              <div className="h-px bg-border my-2" />
              <p className="text-[10px] text-muted-foreground px-2 py-1">Custom Communities</p>
              {customCommunities.map((community) => {
                const isActive = pathname === `/community/${community.id}`
                const isMember = isAuthenticated && isMemberOf(community.id)
                return (
                  <Button
                    key={community.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs h-9"
                    asChild
                  >
                    <Link href={`/community/${community.id}`}>
                      <span className="mr-2 text-base">{community.icon}</span>
                      <span className="flex-1 text-left">{community.name}</span>
                      {isMember && <Check className="w-3 h-3 text-green-500 mr-1" />}
                      <span className="text-muted-foreground text-[10px]">
                        {(community.memberCount / 1000).toFixed(1)}k
                      </span>
                    </Link>
                  </Button>
                )
              })}
            </>
          )}

          <div className="pt-2">
            <CreateCommunityDialog />
          </div>
        </div>
      </Card>

      {/* Community Guidelines */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3 text-foreground">Community Guidelines</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• Share music you genuinely love</p>
          <p>• Recommend similar vibes in comments</p>
          <p>• Be respectful of all genres</p>
          <p>• No spam or self-promotion</p>
        </div>
      </Card>
    </aside>
  )
}
