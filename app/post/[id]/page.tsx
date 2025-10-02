"use client"

import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"
import { CommentSection } from "@/components/comment-section"
import { usePosts } from "@/lib/posts-context"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Post } from "@/lib/types"

interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  const { getPost } = usePosts()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundPost = getPost(params.id)
    setPost(foundPost || null)
    setLoading(false)
  }, [params.id, getPost])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </Link>

          {/* Post */}
          <PostCard post={post} />

          {/* Comments */}
          <div className="bg-card rounded-lg border border-border p-6">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
