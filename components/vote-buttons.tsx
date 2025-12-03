"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface VoteButtonsProps {
  upvotes: number
  downvotes: number
  userVote?: "up" | "down" | null
  onVote?: (type: "up" | "down") => void
  orientation?: "vertical" | "horizontal"
}

export function VoteButtons({ upvotes, downvotes, userVote, onVote, orientation = "vertical" }: VoteButtonsProps) {
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (type: "up" | "down") => {
    if (isVoting) return

    setIsVoting(true)
    try {
      await onVote?.(type)
    } finally {
      setTimeout(() => setIsVoting(false), 300)
    }
  }

  const score = upvotes - downvotes

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote("up")}
          disabled={isVoting}
          className={`h-8 px-2 ${userVote === "up" ? "text-orange-500 bg-orange-50" : "text-muted-foreground hover:text-orange-500"}`}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="ml-1 text-xs">{upvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote("down")}
          disabled={isVoting}
          className={`h-8 px-2 ${userVote === "down" ? "text-blue-500 bg-blue-50" : "text-muted-foreground hover:text-blue-500"}`}
        >
          <ChevronDown className="w-4 h-4" />
          <span className="ml-1 text-xs">{downvotes}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("up")}
        disabled={isVoting}
        className={`h-8 w-8 p-0 ${userVote === "up" ? "text-orange-500 bg-orange-50" : "text-muted-foreground hover:text-orange-500"}`}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <span
        className={`text-sm font-medium ${score > 0 ? "text-orange-500" : score < 0 ? "text-blue-500" : "text-muted-foreground"}`}
      >
        {score}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("down")}
        disabled={isVoting}
        className={`h-8 w-8 p-0 ${userVote === "down" ? "text-blue-500 bg-blue-50" : "text-muted-foreground hover:text-blue-500"}`}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  )
}
