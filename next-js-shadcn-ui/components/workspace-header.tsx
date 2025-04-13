"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Save, Settings } from "lucide-react"
import { LocalStorage, type Novel } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function WorkspaceHeader({ novel }: { novel: Novel }) {
  const [title, setTitle] = useState(novel.title)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSaveTitle = async () => {
    if (title === novel.title) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      const updatedNovel = {
        ...novel,
        title,
        updated_at: new Date().toISOString(),
      }

      LocalStorage.saveNovel(updatedNovel)

      toast({
        title: "标题已更新",
        description: "小说标题已成功更新",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存标题时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-[200px] h-8"
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            autoFocus
            disabled={isSaving}
          />
        ) : (
          <h2 className="text-xl font-bold cursor-pointer" onClick={() => setIsEditing(true)}>
            {title}
          </h2>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={handleSaveTitle} disabled={isSaving || !isEditing}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "保存中..." : "保存"}
        </Button>
        <Link href="/settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
        </Link>
      </div>
    </div>
  )
}
