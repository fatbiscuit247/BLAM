"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoteButtonsProps {
  upvotes: number
  downvotes: number
  userVote?: "up" | "down" | null
  onVote?: (type: "up" | "down") => void
  orientation?: "vertical" | "horizontal"
}

export function VoteButtons({ upvotes, downvotes, userVote, onVote, orientation = "vertical" }: VoteButtonsProps) {
  const [currentVote, setCurrentVote] = useState(userVote)
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes)
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes)

  const handleVote = (type: "up" | "down") => {
    let newUpvotes = currentUpvotes
    let newDownvotes = currentDownvotes
    let newVote: "up" | "down" | null = type

    // Remove previous vote
    if (currentVote === "up") {
      newUpvotes--
    } else if (currentVote === "down") {
      newDownvotes--
    }

    // Add new vote or remove if same
    if (currentVote === type) {
      newVote = null
    } else {
      if (type === "up") {
        newUpvotes++
      } else {
        newDownvotes++
      }
    }

    setCurrentVote(newVote)
    setCurrentUpvotes(newUpvotes)
    setCurrentDownvotes(newDownvotes)
    onVote?.(type)
  }

  const score = currentUpvotes - currentDownvotes

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote("up")}
          className={`h-8 px-2 ${currentVote === "up" ? "text-orange-500 bg-orange-50" : "text-muted-foreground hover:text-orange-500"}`}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="ml-1 text-xs">{currentUpvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote("down")}
          className={`h-8 px-2 ${currentVote === "down" ? "text-blue-500 bg-blue-50" : "text-muted-foreground hover:text-blue-500"}`}
        >
          <ChevronDown className="w-4 h-4" />
          <span className="ml-1 text-xs">{currentDownvotes}</span>
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
        className={`h-8 w-8 p-0 ${currentVote === "up" ? "text-orange-500 bg-orange-50" : "text-muted-foreground hover:text-orange-500"}`}
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
        className={`h-8 w-8 p-0 ${currentVote === "down" ? "text-blue-500 bg-blue-50" : "text-muted-foreground hover:text-blue-500"}`}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  )
}
