import { notFound } from "next/navigation"
import { Calendar, Music, MessageCircle, TrendingUp } from "lucide-react"
import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { mockUsers, mockPosts } from "@/lib/mock-data"

interface UserPageProps {
  params: {
    username: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  const user = mockUsers.find((u) => u.username === params.username)
  const userPosts = mockPosts.filter((p) => p.user.username === params.username)

  if (!user) {
    notFound()
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback className="text-2xl">{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">u/{user.username}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">{userPosts.length}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {userPosts.reduce((sum, post) => sum + post.upvotes, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Upvotes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {userPosts.reduce((sum, post) => sum + post.commentCount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Follow
                </Button>
              </div>
            </div>
          </Card>

          {/* User's Favorite Genres */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-500" />
              Favorite Genres
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Synthwave", "Electronic", "Indie Rock"].map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          </Card>

          {/* User's Posts */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Recent Posts
            </h2>

            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No posts yet. Start sharing some music!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
