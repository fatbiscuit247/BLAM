import { TrendingUp, Music, Users, Headphones, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicPlayer } from "@/components/music-player"
import { mockSongs, mockUsers } from "@/lib/mock-data"

export default function DiscoverPage() {
  const trendingSongs = mockSongs.slice(0, 3)
  const featuredUsers = mockUsers.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover New Music
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore trending songs, discover new artists, and connect with music lovers who share your taste.
            </p>
          </div>

          {/* Search */}
          <Card className="p-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input placeholder="Search for songs, artists, or users..." className="pl-12 h-12" />
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trending Songs */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Trending This Week
                </h2>
                <div className="space-y-4">
                  {trendingSongs.map((song, index) => (
                    <div key={song.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <MusicPlayer song={song} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Genre Exploration */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-500" />
                  Explore by Genre
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Synthwave", color: "from-purple-400 to-pink-400", count: "2.1k posts" },
                    { name: "Indie Rock", color: "from-blue-400 to-cyan-400", count: "1.8k posts" },
                    { name: "Electronic", color: "from-green-400 to-teal-400", count: "3.2k posts" },
                    { name: "Hip Hop", color: "from-orange-400 to-red-400", count: "2.7k posts" },
                  ].map((genre) => (
                    <Button
                      key={genre.name}
                      variant="outline"
                      className="h-20 flex-col gap-2 hover:shadow-md transition-shadow bg-transparent"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${genre.color} rounded-full`} />
                      <div className="text-center">
                        <div className="font-medium text-sm">{genre.name}</div>
                        <div className="text-xs text-muted-foreground">{genre.count}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Users */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Featured Music Lovers
                </h2>
                <div className="space-y-4">
                  {featuredUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-white font-medium text-sm">{user.username[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">u/{user.username}</p>
                        <p className="text-xs text-muted-foreground">Music enthusiast</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Music Stats */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-green-500" />
                  Community Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Songs Shared</span>
                    <span className="font-medium">12.4k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="font-medium">3.2k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recommendations Made</span>
                    <span className="font-medium">28.1k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Genres Covered</span>
                    <span className="font-medium">47</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
