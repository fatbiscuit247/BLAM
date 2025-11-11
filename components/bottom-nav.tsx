"use client"

import { Home, Compass, Music2, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { communities } from "@/lib/communities"
import { usePosts } from "@/lib/posts-context"
import { Check } from "lucide-react"
import { CreateCommunityDialog } from "./create-community-dialog"

export function BottomNav() {
  const pathname = usePathname()
  const { user, isAuthenticated, isMemberOf } = useAuth()
  const { customCommunities } = usePosts()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <Link href="/" className="flex flex-col items-center justify-center flex-1 gap-1">
          <Home
            className={cn("w-6 h-6", isActive("/") ? "text-purple-500 fill-purple-500" : "text-muted-foreground")}
          />
          <span
            className={cn("text-[10px]", isActive("/") ? "text-purple-500 font-semibold" : "text-muted-foreground")}
          >
            Home
          </span>
        </Link>

        {/* Discover */}
        <Link href="/discover" className="flex flex-col items-center justify-center flex-1 gap-1">
          <Compass
            className={cn(
              "w-6 h-6",
              isActive("/discover") ? "text-purple-500 fill-purple-500" : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "text-[10px]",
              isActive("/discover") ? "text-purple-500 font-semibold" : "text-muted-foreground",
            )}
          >
            Discover
          </span>
        </Link>

        {/* Communities Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center flex-1 gap-1">
              <Music2
                className={cn(
                  "w-6 h-6",
                  pathname.startsWith("/community") ? "text-purple-500 fill-purple-500" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[10px]",
                  pathname.startsWith("/community") ? "text-purple-500 font-semibold" : "text-muted-foreground",
                )}
              >
                Communities
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Music Communities</SheetTitle>
              <SheetDescription>Join communities to share and discover music</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-2 overflow-y-auto max-h-[calc(80vh-120px)] pb-4">
              {communities.map((community) => {
                const isActive = pathname === `/community/${community.id}`
                const isMember = isAuthenticated && isMemberOf(community.id)
                return (
                  <Link key={community.id} href={`/community/${community.id}`}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start h-14"
                      style={{ backgroundColor: isActive ? `${community.color}20` : undefined }}
                    >
                      <span className="text-2xl mr-3">{community.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{community.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(community.memberCount / 1000).toFixed(1)}k members
                        </p>
                      </div>
                      {isMember && <Check className="w-4 h-4 text-green-500" />}
                    </Button>
                  </Link>
                )
              })}

              {customCommunities.length > 0 && (
                <>
                  <div className="h-px bg-border my-4" />
                  <p className="text-sm text-muted-foreground px-2 py-2 font-semibold">Custom Communities</p>
                  {customCommunities.map((community) => {
                    const isActive = pathname === `/community/${community.id}`
                    const isMember = isAuthenticated && isMemberOf(community.id)
                    return (
                      <Link key={community.id} href={`/community/${community.id}`}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start h-14"
                          style={{ backgroundColor: isActive ? `${community.color}20` : undefined }}
                        >
                          <span className="text-2xl mr-3">{community.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="font-medium">{community.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(community.memberCount / 1000).toFixed(1)}k members
                            </p>
                          </div>
                          {isMember && <Check className="w-4 h-4 text-green-500" />}
                        </Button>
                      </Link>
                    )
                  })}
                </>
              )}

              <div className="pt-4">
                <CreateCommunityDialog />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Profile */}
        {isAuthenticated && user ? (
          <Link href={`/profile/${user.username}`} className="flex flex-col items-center justify-center flex-1 gap-1">
            <User
              className={cn(
                "w-6 h-6",
                pathname === `/profile/${user.username}` ? "text-purple-500 fill-purple-500" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-[10px]",
                pathname === `/profile/${user.username}` ? "text-purple-500 font-semibold" : "text-muted-foreground",
              )}
            >
              Profile
            </span>
          </Link>
        ) : (
          <Link href="/settings" className="flex flex-col items-center justify-center flex-1 gap-1">
            <User
              className={cn(
                "w-6 h-6",
                pathname === "/settings" ? "text-purple-500 fill-purple-500" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-[10px]",
                pathname === "/settings" ? "text-purple-500 font-semibold" : "text-muted-foreground",
              )}
            >
              Profile
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
