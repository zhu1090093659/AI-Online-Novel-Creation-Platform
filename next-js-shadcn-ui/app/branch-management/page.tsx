"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GitBranch, GitMerge, GitCompare, GitCommit, ArrowLeft, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { LocalStorage, type Novel } from "@/lib/local-storage"

function BranchManagementContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const novelId = searchParams.get('novelId')
  const [novel, setNovel] = useState<Novel | null>(null)

  // 加载小说信息
  useEffect(() => {
    if (novelId) {
      const novelData = LocalStorage.getNovelById(novelId)
      if (novelData) {
        setNovel(novelData)
      } else {
        toast({
          title: "小说不存在",
          description: "找不到指定的小说",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }
  }, [novelId, router, toast])

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "主线剧情",
      description: "原始剧情走向",
      lastEdited: "2023-04-10",
      chapters: 12,
      isMain: true,
    },
    {
      id: 2,
      name: "支线-林逸黑化",
      description: "探索主角黑化的可能性",
      lastEdited: "2023-04-08",
      chapters: 8,
      isMain: false,
    },
    {
      id: 3,
      name: "支线-仙魔大战",
      description: "探索仙魔大战的另一种可能",
      lastEdited: "2023-04-05",
      chapters: 5,
      isMain: false,
    },
  ])

  const [newBranch, setNewBranch] = useState({
    name: "",
    description: "",
    baseBranch: "1",
    branchPoint: "chapter1"
  })

  const [isCreating, setIsCreating] = useState(false)

  const handleCreateBranch = () => {
    if (!newBranch.name.trim()) {
      toast({
        title: "分支名称不能为空",
        description: "请输入分支名称",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    // 模拟创建分支的过程
    setTimeout(() => {
      const newBranchObj = {
        id: branches.length + 1,
        name: newBranch.name,
        description: newBranch.description || "无描述",
        lastEdited: new Date().toLocaleDateString(),
        chapters: 1,
        isMain: false,
      }

      setBranches([...branches, newBranchObj])

      setNewBranch({
        name: "",
        description: "",
        baseBranch: "1",
        branchPoint: "chapter1"
      })

      toast({
        title: "分支创建成功",
        description: `已成功创建分支 "${newBranchObj.name}"`
      })

      setIsCreating(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Link href={novelId ? `/workspace/${novelId}` : "/dashboard"}>
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">分支管理系统 {novel?.title ? `- ${novel.title}` : ""}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>分支列表</CardTitle>
              <CardDescription>管理你的小说情节分支</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branches.map((branch) => (
                  <div key={branch.id} className="flex items-center p-4 border rounded-lg">
                    <div className="mr-4">
                      {branch.isMain ? (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <GitBranch className="h-5 w-5 text-purple-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <GitCommit className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{branch.name}</h4>
                        {branch.isMain && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                            主线
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{branch.description}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>上次编辑: {branch.lastEdited}</span>
                        <span className="mx-2">•</span>
                        <span>{branch.chapters} 章</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        查看
                      </Button>
                      <Button variant="ghost" size="sm">
                        <GitCompare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>分支可视化</CardTitle>
              <CardDescription>树状结构图展示分支关系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[300px] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <GitBranch className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">分支关系图将在这里显示</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>创建新分支</CardTitle>
              <CardDescription>基于现有分支创建新的情节走向</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-branch">基于分支</Label>
                  <select
                    id="base-branch"
                    name="base-branch"
                    aria-label="基于分支"
                    className="w-full p-2 border rounded-md"
                    value={newBranch.baseBranch}
                    onChange={(e) => setNewBranch({...newBranch, baseBranch: e.target.value})}
                  >
                    <option value="1">主线剧情</option>
                    <option value="2">支线-林逸黑化</option>
                    <option value="3">支线-仙魔大战</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>分支名称</Label>
                  <Input
                    placeholder="为新分支命名"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>分支描述</Label>
                  <Textarea
                    placeholder="描述这个分支的目的..."
                    value={newBranch.description}
                    onChange={(e) => setNewBranch({ ...newBranch, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch-point">分支点</Label>
                  <select
                    id="branch-point"
                    name="branch-point"
                    aria-label="分支点"
                    className="w-full p-2 border rounded-md"
                    value={newBranch.branchPoint}
                    onChange={(e) => setNewBranch({...newBranch, branchPoint: e.target.value})}
                  >
                    <option value="chapter1">第1章</option>
                    <option value="chapter2">第2章</option>
                    <option value="chapter3">第3章</option>
                    <option value="chapter4">第4章</option>
                  </select>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleCreateBranch}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <GitBranch className="mr-2 h-4 w-4" />
                      创建分支
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>分支操作</CardTitle>
              <CardDescription>管理和比较分支</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <GitCompare className="mr-2 h-4 w-4" />
                  比较分支
                </Button>

                <Button variant="outline" className="w-full">
                  <GitMerge className="mr-2 h-4 w-4" />
                  合并分支
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function BranchManagement() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">加载中...</div>}>
      <BranchManagementContent />
    </Suspense>
  )
}
