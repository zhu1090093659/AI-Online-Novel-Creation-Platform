"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookPlus, BookText, Clock, Edit3, Plus, Settings, Sparkles, RefreshCw, Trash2, BarChart2 } from "lucide-react"
import { LocalStorage, type Novel } from "@/lib/local-storage"

export default function Dashboard() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [novelToDelete, setNovelToDelete] = useState<string | null>(null)
  const [newNovel, setNewNovel] = useState({
    title: "",
    genre: "",
  })
  const [stats, setStats] = useState({
    totalNovels: 0,
    totalChapters: 0,
    totalCharacters: 0,
    recentlyEdited: 0
  })

  // 加载用户的小说
  useEffect(() => {
    const loadNovels = () => {
      setIsLoading(true)
      try {
        const userNovels = LocalStorage.getNovels()
        setNovels(userNovels)

        // 计算统计数据
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        const totalChapters = userNovels.reduce((sum, novel) => sum + novel.chapters.length, 0)
        const totalCharacters = userNovels.reduce((sum, novel) => sum + novel.characters.length, 0)
        const recentlyEdited = userNovels.filter(novel =>
          new Date(novel.updated_at) > oneWeekAgo
        ).length

        setStats({
          totalNovels: userNovels.length,
          totalChapters,
          totalCharacters,
          recentlyEdited
        })
      } catch (error) {
        console.error("加载小说失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNovels()
  }, [])

  const handleCreateNovel = () => {
    try {
      const now = new Date().toISOString()
      const novelId = LocalStorage.generateId()

      const novel: Novel = {
        id: novelId,
        title: newNovel.title,
        description: "",
        genre: newNovel.genre,
        cover_url: "/placeholder.svg?height=150&width=100",
        created_at: now,
        updated_at: now,
        chapters: [],
        characters: [],
        worldbuilding: null,
        outline: "",
      }

      LocalStorage.saveNovel(novel)
      setNovels([novel, ...novels])
      setNewNovel({ title: "", genre: "" })
      setOpen(false)

      // 更新统计数据
      setStats(prev => ({
        ...prev,
        totalNovels: prev.totalNovels + 1,
        recentlyEdited: prev.recentlyEdited + 1
      }))
    } catch (error) {
      console.error("创建小说失败:", error)
    }
  }

  const handleDeleteNovel = () => {
    if (!novelToDelete) return

    try {
      LocalStorage.deleteNovel(novelToDelete)
      setNovels(novels.filter(novel => novel.id !== novelToDelete))

      // 更新统计数据
      const deletedNovel = novels.find(novel => novel.id === novelToDelete)
      if (deletedNovel) {
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const wasRecentlyEdited = new Date(deletedNovel.updated_at) > oneWeekAgo ? 1 : 0

        setStats(prev => ({
          ...prev,
          totalNovels: prev.totalNovels - 1,
          totalChapters: prev.totalChapters - deletedNovel.chapters.length,
          totalCharacters: prev.totalCharacters - deletedNovel.characters.length,
          recentlyEdited: prev.recentlyEdited - wasRecentlyEdited
        }))
      }
    } catch (error) {
      console.error("删除小说失败:", error)
    } finally {
      setDeleteDialogOpen(false)
      setNovelToDelete(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">我的创作</h1>
          {!isLoading && novels.length > 0 && (
            <p className="text-gray-500 mt-1">共 {stats.totalNovels} 部小说，{stats.totalChapters} 个章节</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Link href="/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              设置
            </Button>
          </Link>
          <Link href="/workflow">
            <Button variant="outline" className="bg-purple-50">
              <RefreshCw className="mr-2 h-4 w-4" />
              创作工作流
            </Button>
          </Link>
          <Link href="/quick-create">
            <Button variant="outline" className="bg-purple-50">
              <Sparkles className="mr-2 h-4 w-4" />
              一键创作
            </Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" /> 新建小说
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新小说</DialogTitle>
                <DialogDescription>填写基本信息开始你的创作之旅</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    小说名称
                  </Label>
                  <Input
                    id="title"
                    value={newNovel.title}
                    onChange={(e) => setNewNovel({ ...newNovel, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="genre" className="text-right">
                    小说类型
                  </Label>
                  <Select value={newNovel.genre} onValueChange={(value) => setNewNovel({ ...newNovel, genre: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="玄幻">玄幻</SelectItem>
                      <SelectItem value="仙侠">仙侠</SelectItem>
                      <SelectItem value="都市">都市</SelectItem>
                      <SelectItem value="科幻">科幻</SelectItem>
                      <SelectItem value="言情">言情</SelectItem>
                      <SelectItem value="悬疑">悬疑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleCreateNovel}
                  disabled={!newNovel.title.trim()}
                >
                  创建
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      {!isLoading && novels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">总小说数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookText className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-2xl font-bold">{stats.totalNovels}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">总章节数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookPlus className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-2xl font-bold">{stats.totalChapters}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">角色数量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-2xl font-bold">{stats.totalCharacters}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">近期活跃</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-2xl font-bold">{stats.recentlyEdited}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>加载中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novels.length > 0 ? (
            novels.map((novel) => (
              <Card key={novel.id} className="overflow-hidden">
                <div className="flex">
                  <img
                    src={novel.cover_url || "/placeholder.svg?height=150&width=100"}
                    alt={novel.title}
                    className="w-[100px] h-[150px] object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{novel.title}</CardTitle>
                    <CardDescription>
                      {novel.genre} · {novel.chapters.length} 章
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>上次编辑: {new Date(novel.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Link href={`/workspace/${novel.id}`}>
                      <Button variant="outline">
                        <Edit3 className="mr-2 h-4 w-4" /> 继续创作
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setNovelToDelete(novel.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link href={`/novel/${novel.id}`}>
                    <Button variant="ghost">
                      <BookText className="mr-2 h-4 w-4" /> 查看
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-8">
              <BookPlus className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">还没有创作</h3>
              <p className="text-gray-500 mb-6 text-center">
                您还没有创建任何小说。点击"新建小说"按钮开始您的创作之旅，或者使用"一键创作"功能快速生成创作框架。
              </p>
              <div className="flex space-x-4">
                <Link href="/quick-create">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    一键创作
                  </Button>
                </Link>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      新建小说
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </Card>
          )}

          {novels.length > 0 && (
            <Card className="flex flex-col items-center justify-center h-[250px] border-dashed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <div className="flex flex-col items-center p-6">
                    <BookPlus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">创建新小说</p>
                    <p className="text-sm text-gray-500">开始你的创作之旅</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新小说</DialogTitle>
                    <DialogDescription>填写基本信息开始你的创作之旅</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title-2" className="text-right">
                        小说名称
                      </Label>
                      <Input
                        id="title-2"
                        value={newNovel.title}
                        onChange={(e) => setNewNovel({ ...newNovel, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="genre-2" className="text-right">
                        小说类型
                      </Label>
                      <Select
                        value={newNovel.genre}
                        onValueChange={(value) => setNewNovel({ ...newNovel, genre: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="玄幻">玄幻</SelectItem>
                          <SelectItem value="仙侠">仙侠</SelectItem>
                          <SelectItem value="都市">都市</SelectItem>
                          <SelectItem value="科幻">科幻</SelectItem>
                          <SelectItem value="言情">言情</SelectItem>
                          <SelectItem value="悬疑">悬疑</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      取消
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleCreateNovel}
                      disabled={!newNovel.title.trim()}
                    >
                      创建
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          )}
        </div>
      )}

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这部小说吗？此操作无法撤销，所有相关的章节和角色数据都将被删除。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteNovel}>
              <Trash2 className="mr-2 h-4 w-4" />
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
