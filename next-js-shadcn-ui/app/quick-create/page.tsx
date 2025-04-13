"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ApiService, type AIGenerationResult } from "@/lib/api-service"
import { LocalStorage, type Novel, type Character, type WorldBuilding } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"

export default function QuickCreatePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AIGenerationResult | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "提示不能为空",
        description: "请输入创作提示",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const generationResult = await ApiService.generateContent({
        prompt,
        type: "novel",
      })

      if (generationResult.error) {
        toast({
          title: "生成失败",
          description: generationResult.error,
          variant: "destructive",
        })
        return
      }

      setResult(generationResult)
    } catch (error) {
      toast({
        title: "生成失败",
        description: "生成内容时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (!result) return

    try {
      // 创建新小说
      const now = new Date().toISOString()
      const novelId = LocalStorage.generateId()

      // 创建角色
      const characters: Character[] =
        result.characters?.map((char) => ({
          id: LocalStorage.generateId(),
          novel_id: novelId,
          name: char.name,
          role: char.role,
          age: char.age,
          gender: char.gender,
          appearance: char.appearance,
          personality: char.personality,
          background: char.background,
          abilities: char.abilities,
          created_at: now,
          updated_at: now,
        })) || []

      // 创建世界观
      let worldbuilding: WorldBuilding | null = null
      if (result.worldbuilding) {
        worldbuilding = {
          id: LocalStorage.generateId(),
          novel_id: novelId,
          name: result.worldbuilding.name,
          description: result.worldbuilding.description,
          civilization_level: result.worldbuilding.civilization_level,
          magic_tech_level: result.worldbuilding.magic_tech_level,
          rules: result.worldbuilding.rules,
          history: result.worldbuilding.history,
          created_at: now,
        }
      }

      // 创建小说对象
      const novel: Novel = {
        id: novelId,
        title: result.title || "未命名小说",
        description: result.description || "",
        genre: result.genre || "其他",
        cover_url: "/placeholder.svg?height=150&width=100",
        created_at: now,
        updated_at: now,
        chapters: [],
        characters,
        worldbuilding,
        outline: result.outline || "",
      }

      // 保存小说
      LocalStorage.saveNovel(novel)

      toast({
        title: "保存成功",
        description: "小说已成功保存",
      })

      // 跳转到工作区
      router.push(`/workspace/${novelId}`)
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存小说时发生错误",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">一键创作</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>创作提示</CardTitle>
            <CardDescription>描述您想要创作的小说内容，AI 将为您生成完整的创作框架</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="例如：一个修仙世界中的少年意外获得上古传承，踏上修炼之路的故事..."
              className="min-h-[200px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  一键生成
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>{result.title || "生成结果"}</CardTitle>
              <CardDescription>{result.genre || "小说框架"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">简介</h3>
                <p className="text-sm text-gray-600">{result.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">大纲</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{result.outline}</p>
              </div>

              {result.characters && result.characters.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">主要角色</h3>
                  <ul className="text-sm text-gray-600 list-disc pl-5">
                    {result.characters.map((char, index) => (
                      <li key={index}>
                        {char.name} - {char.role}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
                保存并开始创作
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
