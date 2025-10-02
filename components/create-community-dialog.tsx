"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePosts } from "@/lib/posts-context"
import { getCurrentUser } from "@/lib/auth"
import type { Community } from "@/lib/types"

const colorOptions = [
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Teal", value: "bg-teal-500" },
]

const iconOptions = ["🎵", "🎸", "🎹", "🎤", "🎧", "🎺", "🎻", "🥁", "🎼", "🎶", "💿", "📻", "🔊", "🎙️", "🎚️"]

export function CreateCommunityDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("🎵")
  const [selectedColor, setSelectedColor] = useState("bg-purple-500")
  const { addCommunity } = usePosts()
  const user = getCurrentUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !description.trim()) {
      return
    }

    const communityId = name.toLowerCase().replace(/\s+/g, "-")

    const newCommunity: Community = {
      id: communityId,
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      color: selectedColor,
      memberCount: 1,
      isCustom: true,
      createdBy: user?.id,
    }

    addCommunity(newCommunity)

    // Reset form
    setName("")
    setDescription("")
    setSelectedIcon("🎵")
    setSelectedColor("bg-purple-500")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Community</DialogTitle>
          <DialogDescription>Start a new music community around a theme, genre, or vibe you love.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              placeholder="e.g., Jazz Lovers, 90s Hip Hop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    selectedIcon === icon
                      ? "bg-primary text-primary-foreground ring-2 ring-primary"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-lg ${color.value} transition-all ${
                    selectedColor === color.value ? "ring-2 ring-offset-2 ring-foreground" : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Community</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
