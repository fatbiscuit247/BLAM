"use client"

import { useAuth } from "@/lib/auth-context"
import { usePosts } from "@/lib/posts-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "@/components/post-card"
import { BottomNav } from "@/components/bottom-nav"
import { Music, Calendar } from "lucide-react"
import Link from "next/link"

export function ProfileContent({ username }: { username: string }) {
  const { user: currentUser } = useAuth()
  const { getAllPosts } = usePosts()

  // Find user by username
  const allPosts = getAllPosts()
  const userPosts = allPosts.filter((p) => p.user.username === username)
  const profileUser = userPosts[0]?.user

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background p-8 pb-20 md:pb-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="mt-2 text-muted-foreground">The user u/{username} does not exist.</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  const isOwnProfile = currentUser?.username === username
  const joinDate = new Date(profileUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileUser.avatar || "/placeholder.svg"} alt={profileUser.username} />
              <AvatarFallback>{profileUser.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">u/{profileUser.username}</h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Music className="h-4 w-4" />
                  <span>{userPosts.length} posts</span>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <Link href="/settings">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            )}
          </div>
        </Card>

        {/* User Posts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Posts</h2>
          {userPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No posts yet</p>
            </Card>
          ) : (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
