"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Sparkles, Save, Loader2 } from "lucide-react"
import { ApiService } from "@/lib/api-service"
import { LocalStorage, type Novel, type Character, type WorldBuilding } from "@/lib/local-storage"

// 工作流步骤
const STEPS = [
  { id: "prompt", label: "创作提示" },
  { id: "outline", label: "小说大纲" },
  { id: "characters", label: "角色卡片" },
  { id: "mainplot", label: "主线情节" },
  { id: "subplots", label: "支线情节" },
  { id: "worldbuilding", label: "世界观" },
  { id: "review", label: "最终审核" },
]

export default function WorkflowPage() {
  const router = useRouter()
  const { toast } = useToast()

  // 状态管理
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [novelTitle, setNovelTitle] = useState("")
  const [novelGenre, setNovelGenre] = useState("")
  const [outline, setOutline] = useState("")
  const [characters, setCharacters] = useState<Character[]>([])
  const [mainPlot, setMainPlot] = useState("")
  const [subPlots, setSubPlots] = useState<string[]>([])
  const [worldbuilding, setWorldbuilding] = useState<Partial<WorldBuilding> | null>(null)

  // 进度计算
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // 生成大纲
  const generateOutline = async () => {
    if (!prompt.trim()) {
      toast({
        title: "提示不能为空",
        description: "请输入创作提示",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const result = await ApiService.generateContent({
        prompt: `根据以下提示生成一个详细的小说大纲，包括标题、类型、主要情节发展和转折点：\n\n${prompt}`,
        type: "novel",
      })

      if (result.error) {
        toast({
          title: "生成失败",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setNovelTitle(result.title || "未命名小说")
      setNovelGenre(result.genre || "其他")
      setOutline(typeof result.outline === 'string' ? result.outline : 
                (result.outline ? JSON.stringify(result.outline, null, 2) : ""))

      toast({
        title: "大纲生成成功",
        description: "小说大纲已生成",
      })

      // 自动进入下一步
      setCurrentStep(2)
    } catch (error) {
      toast({
        title: "生成失败",
        description: "生成大纲时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 生成角色卡
  const generateCharacters = async () => {
    if (!outline || typeof outline !== 'string' || !outline.trim()) {
      toast({
        title: "大纲不能为空",
        description: "请先生成小说大纲",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const result = await ApiService.generateContent({
        prompt: `根据以下小说大纲，生成3-5个主要角色的详细角色卡，包括姓名、角色定位、年龄、性别、外貌、性格、背景故事和能力：\n\n标题：${novelTitle}\n类型：${novelGenre}\n大纲：${typeof outline === 'string' ? outline : ''}`,
        type: "character",
      })

      // 调试日志
      console.log("角色生成结果:", JSON.stringify(result, null, 2));

      if (result.error) {
        toast({
          title: "生成失败",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.characters && result.characters.length > 0) {
        const now = new Date().toISOString()
        const novelId = LocalStorage.generateId() // 临时ID，最终保存时会更新

        const formattedCharacters = result.characters.map((char) => ({
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
        }))

        setCharacters(formattedCharacters)

        toast({
          title: "角色卡生成成功",
          description: `已生成 ${formattedCharacters.length} 个角色`,
        })

        // 自动进入下一步
        setCurrentStep(3)
      } else {
        toast({
          title: "生成失败",
          description: "未能生成有效的角色卡",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "生成失败",
        description: "生成角色卡时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 生成主线情节
  const generateMainPlot = async () => {
    if (!outline || typeof outline !== 'string' || !outline.trim() || characters.length === 0) {
      toast({
        title: "信息不完整",
        description: "请先生成小说大纲和角色卡",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // 构建角色信息
      const charactersInfo = characters
        .map((char) => `角色名：${char.name}，定位：${char.role}，背景：${char.background.substring(0, 100)}...`)
        .join("\n")

      const result = await ApiService.generateContent({
        prompt: `根据以下小说大纲和角色信息，生成详细的主线情节发展，包括起因、经过、高潮和结局：\n\n标题：${novelTitle}\n类型：${novelGenre}\n大纲：${typeof outline === 'string' ? outline : ''}\n\n角色信息：\n${charactersInfo}`,
        type: "outline",
      })

      if (result.error) {
        toast({
          title: "生成失败",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setMainPlot(result.outline || "")

      toast({
        title: "主线情节生成成功",
        description: "小说主线情节已生成",
      })

      // 自动进入下一步
      setCurrentStep(4)
    } catch (error) {
      toast({
        title: "生成失败",
        description: "生成主线情节时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 生成支线情节
  const generateSubPlots = async () => {
    if (!mainPlot.trim()) {
      toast({
        title: "主线情节不能为空",
        description: "请先生成主线情节",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // 构建角色信息
      const charactersInfo = characters.map((char) => `角色名：${char.name}，定位：${char.role}`).join("\n")

      const result = await ApiService.generateContent({
        prompt: `根据以下小说大纲、角色信息和主线情节，生成3个有趣的支线情节，每个支线情节应该与主线有关联但又相对独立，请确保按照"支线1："、"支线2："、"支线3："的格式清晰标记每个支线：\n\n标题：${novelTitle}\n类型：${novelGenre}\n大纲：${typeof outline === 'string' ? outline : ''}\n\n角色信息：\n${charactersInfo}\n\n主线情节：${mainPlot.substring(0, 500)}...`,
        type: "outline",
      })

      // 调试日志
      console.log("支线情节生成结果:", JSON.stringify(result, null, 2));

      if (result.error) {
        toast({
          title: "生成失败",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      // 将生成的支线情节拆分为数组
      const subplotText = result.outline || ""
      console.log("原始支线文本:", subplotText);
      
      // 改进的支线分割逻辑
      let subplotList = [];
      
      // 先尝试用常规方式分割
      const regularSplit = subplotText
        .split(/支线\s*\d+[：:]/i)
        .filter((text) => text.trim().length > 0)
        .map((text) => text.trim());
      
      if (regularSplit.length >= 2) {
        // 常规分割有效
        subplotList = regularSplit;
      } else {
        // 尝试其他分割方式
        const numberSplit = subplotText
          .split(/\d+[\.、．][：:]/i)
          .filter((text) => text.trim().length > 0)
          .map((text) => text.trim());
          
        if (numberSplit.length >= 2) {
          subplotList = numberSplit;
        } else {
          // 尝试按段落分割
          const paragraphSplit = subplotText
            .split(/\n\s*\n/)
            .filter((text) => text.trim().length > 0)
            .map((text) => text.trim());
            
          if (paragraphSplit.length >= 2) {
            subplotList = paragraphSplit;
          } else {
            // 无法分割，保留整个文本
            subplotList = [subplotText];
          }
        }
      }
      
      console.log("分割后的支线列表:", subplotList);
      setSubPlots(subplotList);

      toast({
        title: "支线情节生成成功",
        description: `已生成 ${subplotList.length} 个支线情节`,
      })

      // 自动进入下一步
      setCurrentStep(5)
    } catch (error) {
      toast({
        title: "生成失败",
        description: "生成支线情节时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 生成世界观
  const generateWorldbuilding = async () => {
    setIsGenerating(true)

    try {
      const result = await ApiService.generateContent({
        prompt: `根据以下小说信息，生成详细的世界观设定，包括世界名称、背景描述、文明程度、魔法/科技水平、世界规则和历史：\n\n标题：${novelTitle}\n类型：${novelGenre}\n大纲：${typeof outline === 'string' ? outline : ''}\n\n主线情节：${mainPlot.substring(0, 300)}...`,
        type: "world",
      })

      // 调试信息
      console.log("世界观生成结果:", JSON.stringify(result, null, 2));

      if (result.error) {
        toast({
          title: "生成失败",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.worldbuilding) {
        // 安全地获取数据，防止缺失某些字段导致错误
        const worldData = {
          name: result.worldbuilding.name || "未命名世界",
          description: result.worldbuilding.description || "",
          civilization_level: result.worldbuilding.civilization_level || "",
          magic_tech_level: result.worldbuilding.magic_tech_level || "",
          rules: result.worldbuilding.rules || "",
          history: result.worldbuilding.history || "",
        };
        
        console.log("设置世界观数据:", worldData);
        
        // 设置状态
        setWorldbuilding(worldData);
        
        // 延迟一点时间以确保UI更新完成
        setTimeout(() => {
          toast({
            title: "世界观生成成功",
            description: "小说世界观已生成",
          });
          
          // 自动进入最后一步
          setCurrentStep(6);
        }, 300);
      } else {
        toast({
          title: "生成失败",
          description: "未能生成有效的世界观",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("生成世界观出错:", error);
      toast({
        title: "生成失败",
        description: "生成世界观时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // 保存小说
  const saveNovel = () => {
    try {
      const now = new Date().toISOString()
      const novelId = LocalStorage.generateId()

      // 更新角色的novel_id
      const updatedCharacters = characters.map((char) => ({
        ...char,
        novel_id: novelId,
      }))

      // 创建世界观对象
      let worldbuildingObj: WorldBuilding | null = null
      if (worldbuilding) {
        worldbuildingObj = {
          id: LocalStorage.generateId(),
          novel_id: novelId,
          name: worldbuilding.name || "",
          description: worldbuilding.description || "",
          civilization_level: worldbuilding.civilization_level || "",
          magic_tech_level: worldbuilding.magic_tech_level || "",
          rules: worldbuilding.rules || "",
          history: worldbuilding.history || "",
          created_at: now,
        }
      }

      // 创建小说对象
      const novel: Novel = {
        id: novelId,
        title: novelTitle,
        description: outline.split("\n")[0] || "", // 使用大纲的第一行作为简介
        genre: novelGenre,
        cover_url: "/placeholder.svg?height=150&width=100",
        created_at: now,
        updated_at: now,
        chapters: [],
        characters: updatedCharacters,
        worldbuilding: worldbuildingObj,
        outline: outline,
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

  // 渲染当前步骤
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // 创作提示
        return (
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
            <CardFooter className="flex justify-between">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回
                </Button>
              </Link>
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={!prompt.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                下一步
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )

      case 1: // 生成大纲
        return (
          <Card>
            <CardHeader>
              <CardTitle>生成小说大纲</CardTitle>
              <CardDescription>AI 将根据您的提示生成小说大纲</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">您的创作提示：</h3>
                <p className="text-gray-700">{prompt}</p>
              </div>

              <Button
                onClick={generateOutline}
                disabled={isGenerating}
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
                    一键生成大纲
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={!outline || typeof outline !== 'string' || !outline.trim()}>
                跳过
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )

      case 2: // 角色卡片
        return (
          <Card>
            <CardHeader>
              <CardTitle>生成角色卡片</CardTitle>
              <CardDescription>AI 将根据小说大纲生成主要角色的详细设定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>小说标题</Label>
                <Input value={novelTitle} onChange={(e) => setNovelTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>小说类型</Label>
                <Input value={novelGenre} onChange={(e) => setNovelGenre(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>小说大纲</Label>
                <Textarea value={outline} onChange={(e) => setOutline(e.target.value)} className="min-h-[150px]" />
              </div>

              <Button
                onClick={generateCharacters}
                disabled={isGenerating || !outline || typeof outline !== 'string' || !outline.trim()}
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
                    一键生成角色卡
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(3)} disabled={characters.length === 0}>
                跳过
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )

      case 3: // 主线情节
        return (
          <Card>
            <CardHeader>
              <CardTitle>生成主线情节</CardTitle>
              <CardDescription>AI 将根据大纲和角色卡生成小说的主线情节</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">已生成的角色：</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {characters.map((char, index) => (
                    <li key={index}>
                      {char.name} - {char.role}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={generateMainPlot}
                disabled={isGenerating || characters.length === 0}
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
                    一键生成主线情节
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(4)} disabled={!mainPlot.trim()}>
                跳过
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )

      case 4: // 支线情节
        return (
          <Card>
            <CardHeader>
              <CardTitle>生成支线情节</CardTitle>
              <CardDescription>AI 将根据主线情节生成丰富的支线情节</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>主线情节</Label>
                <div className="p-4 bg-gray-50 rounded-md max-h-[200px] overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-line">{mainPlot}</p>
                </div>
              </div>

              <Button
                onClick={generateSubPlots}
                disabled={isGenerating || !mainPlot.trim()}
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
                    一键生成支线情节
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(5)} disabled={subPlots.length === 0}>
                跳过
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )

      case 5: // 世界观
        return (
          <Card>
            <CardHeader>
              <CardTitle>补充世界观</CardTitle>
              <CardDescription>AI 将生成详细的世界观设定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">已生成的支线情节：</h3>
                <div className="space-y-4">
                  {subPlots.map((subplot, index) => (
                    <div key={index} className="space-y-1">
                      <Label>支线情节 {index + 1}</Label>
                      <Textarea 
                        value={subplot} 
                        onChange={(e) => {
                          const newSubPlots = [...subPlots];
                          newSubPlots[index] = e.target.value;
                          setSubPlots(newSubPlots);
                        }}
                        className="min-h-[120px] max-h-[200px]"
                      />
                    </div>
                  ))}
                </div>

                {/* 添加世界观显示区域 */}
                {worldbuilding && (
                  <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium mb-3">已生成的世界观：</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="font-medium">世界名称</Label>
                        <p className="text-sm mt-1">{worldbuilding.name}</p>
                      </div>
                      <div>
                        <Label className="font-medium">背景描述</Label>
                        <p className="text-sm mt-1 whitespace-pre-line">{worldbuilding.description}</p>
                      </div>
                      <div>
                        <Label className="font-medium">文明程度</Label>
                        <p className="text-sm mt-1">{worldbuilding.civilization_level}</p>
                      </div>
                      <div>
                        <Label className="font-medium">魔法/科技水平</Label>
                        <p className="text-sm mt-1">{typeof worldbuilding.magic_tech_level === 'object' 
                          ? JSON.stringify(worldbuilding.magic_tech_level, null, 2) 
                          : worldbuilding.magic_tech_level}</p>
                      </div>
                      <div>
                        <Label className="font-medium">规则</Label>
                        <p className="text-sm mt-1 whitespace-pre-line">{worldbuilding.rules}</p>
                      </div>
                      <div>
                        <Label className="font-medium">历史</Label>
                        <p className="text-sm mt-1 whitespace-pre-line">{worldbuilding.history}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={generateWorldbuilding}
                disabled={isGenerating}
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
                    一键补充世界观
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(6)} disabled={!worldbuilding}>
                跳过
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )

      case 6: // 最终审核
        return (
          <Card>
            <CardHeader>
              <CardTitle>最终审核</CardTitle>
              <CardDescription>审核生成的小说内容并保存</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="outline">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="outline">大纲</TabsTrigger>
                  <TabsTrigger value="characters">角色</TabsTrigger>
                  <TabsTrigger value="mainplot">主线</TabsTrigger>
                  <TabsTrigger value="subplots">支线</TabsTrigger>
                  <TabsTrigger value="world">世界观</TabsTrigger>
                </TabsList>

                <TabsContent value="outline" className="p-4 bg-gray-50 rounded-md mt-4 max-h-[300px] overflow-y-auto">
                  <h3 className="font-medium mb-2">小说大纲</h3>
                  <p className="whitespace-pre-line">{typeof outline === 'string' ? outline : ''}</p>
                </TabsContent>

                <TabsContent
                  value="characters"
                  className="p-4 bg-gray-50 rounded-md mt-4 max-h-[300px] overflow-y-auto"
                >
                  <h3 className="font-medium mb-2">角色卡片</h3>
                  <div className="space-y-4">
                    {characters.map((char, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">
                          {char.name} - {char.role}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {char.gender}, {char.age}岁
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">外貌：</span> {char.appearance}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">性格：</span> {char.personality}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="mainplot" className="p-4 bg-gray-50 rounded-md mt-4 max-h-[300px] overflow-y-auto">
                  <h3 className="font-medium mb-2">主线情节</h3>
                  <p className="whitespace-pre-line">{mainPlot}</p>
                </TabsContent>

                <TabsContent value="subplots" className="p-4 bg-gray-50 rounded-md mt-4 max-h-[300px] overflow-y-auto">
                  <h3 className="font-medium mb-2">支线情节</h3>
                  <div className="space-y-4">
                    {subPlots.map((subplot, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">支线 {index + 1}</h4>
                        <p className="whitespace-pre-line text-sm">{subplot}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="world" className="p-4 bg-gray-50 rounded-md mt-4 max-h-[300px] overflow-y-auto">
                  <h3 className="font-medium mb-2">世界观</h3>
                  {worldbuilding ? (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">世界名称：</span> {worldbuilding.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">描述：</span> {worldbuilding.description}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">文明程度：</span> {worldbuilding.civilization_level}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">魔法/科技水平：</span> {typeof worldbuilding.magic_tech_level === 'object' 
                          ? JSON.stringify(worldbuilding.magic_tech_level, null, 2) 
                          : worldbuilding.magic_tech_level}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">规则：</span> {worldbuilding.rules}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">历史：</span> {worldbuilding.history}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">尚未生成世界观</p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="space-y-2 mt-4">
                <Label>小说标题</Label>
                <Input value={novelTitle} onChange={(e) => setNovelTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>小说类型</Label>
                <Input value={novelGenre} onChange={(e) => setNovelGenre(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(5)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
              <Button onClick={saveNovel} className="bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" />
                保存并开始创作
              </Button>
            </CardFooter>
          </Card>
        )

      default:
        return null
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
        <h1 className="text-3xl font-bold">创作工作流</h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            步骤 {currentStep + 1} / {STEPS.length}: {STEPS[currentStep].label}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% 完成</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>工作流步骤</CardTitle>
              <CardDescription>按照步骤完成小说创作</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {STEPS.map((step, index) => (
                  <li key={step.id} className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                        index < currentStep
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : index === currentStep
                            ? "bg-purple-100 text-purple-700 border border-purple-300"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {index < currentStep ? "✓" : index + 1}
                    </div>
                    <span
                      className={`${
                        index === currentStep
                          ? "font-medium text-purple-700"
                          : index < currentStep
                            ? "text-green-700"
                            : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>工作流说明</CardTitle>
              <CardDescription>一键生成小说的各个组成部分</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                本工作流将引导您完成小说创作的各个步骤，从创作提示开始，逐步生成小说大纲、角色卡片、主线情节、支线情节和世界观。
              </p>
              <p className="text-sm text-gray-500">
                您可以在每个步骤中使用 AI
                一键生成内容，也可以手动编辑生成的内容。完成所有步骤后，您可以保存小说并开始创作。
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">{renderCurrentStep()}</div>
      </div>
    </div>
  )
}
