"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getCommunity as getDefaultCommunity } from "@/lib/communities"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import type { Song } from "@/lib/types"
import { Users, TrendingUp, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function CommunityPage() {
  const params = useParams()
  const theme = params.theme as string
  const { posts: allPosts, getPostsByTheme, addPost, getCommunity: getCustomCommunity } = usePosts()
  const { user, isAuthenticated, isMemberOf, joinCommunity, leaveCommunity } = useAuth()
  const defaultCommunity = getDefaultCommunity(theme)
  const customCommunity = getCustomCommunity(theme)
  const community = defaultCommunity || customCommunity

  const [posts, setPosts] = useState(getPostsByTheme(theme))
  const isMember = isMemberOf(theme)

  useEffect(() => {
    setPosts(getPostsByTheme(theme))
  }, [theme, getPostsByTheme, allPosts])

  const handleCreatePost = (title: string, content: string, song: Song, postTheme?: string) => {
    if (!isAuthenticated || !user) {
      alert("Please sign in to create posts")
      return
    }

    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      user: user,
      song,
      title,
      content,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: new Date(),
      userVote: null as "up" | "down" | null,
      theme: postTheme || theme,
    }
    addPost(newPost)
    setPosts(getPostsByTheme(theme))
  }

  const handleToggleMembership = () => {
    if (!isAuthenticated) {
      alert("Please sign in to join communities")
      return
    }

    if (isMember) {
      leaveCommunity(theme)
    } else {
      joinCommunity(theme)
    }
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCreatePost={() => {}} />
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">Community not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCreatePost={handleCreatePost} defaultTheme={theme} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <main className="flex-1 max-w-2xl">
            <Card className="mb-6 overflow-hidden">
              <div className={`h-24 ${community.color}`} />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-20 h-20 ${community.color} rounded-full flex items-center justify-center text-4xl -mt-10 border-4 border-background`}
                  >
                    {community.icon}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-1">
                      {community.name}
                      {community.isCustom && (
                        <span className="ml-2 text-xs font-normal bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Custom
                        </span>
                      )}
                    </h1>
                    <p className="text-muted-foreground text-sm mb-4">{community.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{community.memberCount.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{Math.floor(community.memberCount / 10)} online</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleToggleMembership} variant={isMember ? "outline" : "default"}>
                    {isMember ? "Leave" : "Join"}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex gap-2 mb-4">
              <Button variant="secondary" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Hot
              </Button>
              <Button variant="ghost" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                New
              </Button>
              <Button variant="ghost" size="sm">
                Top
              </Button>
            </div>

            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No posts yet in this community</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share a {community.name.toLowerCase()} song!
                  </p>
                </Card>
              )}
            </div>
          </main>

          <div className="hidden xl:block w-80">
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-3">About {community.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{community.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span>{community.memberCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Online</span>
                  <span className="text-green-500">{Math.floor(community.memberCount / 10)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 mt-4">
              <h3 className="font-semibold text-sm mb-3">Community Rules</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>1. Posts must match the community theme</p>
                <p>2. Be respectful and constructive</p>
                <p>3. No spam or self-promotion</p>
                <p>4. Share music you genuinely enjoy</p>
                <p>5. Recommend similar songs in comments</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
