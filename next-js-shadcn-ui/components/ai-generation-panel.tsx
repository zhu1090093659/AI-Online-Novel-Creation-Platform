"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Wand2, RefreshCw, Loader2 } from "lucide-react"
import { ApiService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { LocalStorage, type Novel, type Character, type WorldBuilding } from "@/lib/local-storage"

interface AIGenerationPanelProps {
  novelId: string
  onContentGenerated?: (content: string) => void
}

export default function AIGenerationPanel({ novelId, onContentGenerated }: AIGenerationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("style")
  const [prompt, setPrompt] = useState("")
  const { toast } = useToast()

  // 加载小说背景信息
  const [novel, setNovel] = useState<Novel | null>(null)
  const [useBackgroundInfo, setUseBackgroundInfo] = useState(true)

  // 加载小说信息
  useEffect(() => {
    if (novelId) {
      const novelData = LocalStorage.getNovelById(novelId)
      if (novelData) {
        setNovel(novelData)
      }
    }
  }, [novelId])

  // 文风设置
  const [style, setStyle] = useState("")
  const [detailLevel, setDetailLevel] = useState(7)
  const [dialogueRatio, setDialogueRatio] = useState(4)
  const [rhetoricLevel, setRhetoricLevel] = useState(6)

  // 情节设置
  const [plotType, setPlotType] = useState("")
  const [plotPrompt, setPlotPrompt] = useState("")
  const [plotComplexity, setPlotComplexity] = useState(5)

  // 角色设置
  const [character, setCharacter] = useState("")
  const [emotion, setEmotion] = useState("")
  const [characterPrompt, setCharacterPrompt] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "提示不能为空",
        description: "请输入生成提示",
        variant: "destructive",
      })
      return
    }

    // 检查API密钥是否已配置
    const settings = LocalStorage.getSettings()
    if (!settings.apiKey) {
      toast({
        title: "API密钥未配置",
        description: "请在设置页面配置API密钥",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // 根据当前标签页构建提示
      let finalPrompt = prompt
      let type: "chapter" | "character" | "world" | undefined
      let styleHint = ""

      // 如果选择使用背景信息且小说数据存在，添加背景信息
      if (useBackgroundInfo && novel) {
        let backgroundInfo = "";

        // 添加小说大纲
        if (novel.outline) {
          backgroundInfo += `\n\n小说大纲：${novel.outline}`;
        }

        // 添加角色信息
        if (novel.characters && novel.characters.length > 0) {
          backgroundInfo += "\n\n主要角色：";
          novel.characters.forEach(char => {
            backgroundInfo += `\n${char.name}：${char.role}，${char.gender}，${char.age}岁，${char.personality}`;
          });
        }

        // 添加世界观
        if (novel.worldbuilding) {
          backgroundInfo += `\n\n世界观：${novel.worldbuilding.name}，${novel.worldbuilding.description}`;
          if (novel.worldbuilding.magic_tech_level) {
            backgroundInfo += `\n魔法/科技水平：${novel.worldbuilding.magic_tech_level}`;
          }
        }

        // 将背景信息添加到提示中
        finalPrompt = `请基于以下小说背景信息，${finalPrompt}${backgroundInfo}`;
      }

      switch (activeTab) {
        case "style":
          type = "chapter"
          styleHint = style
          finalPrompt += `\n详细程度: ${detailLevel}/10\n对话比例: ${dialogueRatio}/10\n修辞手法: ${rhetoricLevel}/10`
          break
        case "plot":
          type = "chapter"
          finalPrompt += `\n情节类型: ${plotType}\n情节提示: ${plotPrompt}\n复杂度: ${plotComplexity}/10`
          break
        case "character":
          type = "chapter"
          finalPrompt += `\n角色: ${character}\n情绪: ${emotion}\n行为提示: ${characterPrompt}`
          break
      }

      console.log("生成提示:", finalPrompt);
      console.log("使用类型:", type);
      console.log("文风:", styleHint);

      // 调用 API 生成内容
      const result = await ApiService.generateContent({
        prompt: finalPrompt,
        type,
        style: styleHint,
      })

      console.log("API返回结果:", result);

      if (result.error) {
        toast({
          title: "生成失败",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      // 如果是章节内容，直接传递给父组件
      if (result.chapter?.content && onContentGenerated) {
        console.log("生成的章节内容:", result.chapter.content.substring(0, 100) + "...");
        onContentGenerated("\n\n" + result.chapter.content)
        toast({
          title: "生成成功",
          description: "内容已生成",
        })
      } else if (result.outline && onContentGenerated) {
        // 如果返回了大纲内容
        console.log("生成的大纲内容:", result.outline.substring(0, 100) + "...");
        onContentGenerated("\n\n" + result.outline)
        toast({
          title: "生成成功",
          description: "内容已生成",
        })
      } else {
        // 无法识别的返回格式，尝试直接使用返回的内容
        console.log("无法识别的返回格式，使用备用方案");
        console.log("完整返回结果:", JSON.stringify(result));

        // 尝试从结果中提取任何可能的文本内容
        let content = "";
        if (typeof result === 'object') {
          // 遍历对象的所有属性，寻找字符串类型的值
          for (const key in result) {
            if (typeof result[key] === 'string' && result[key].length > 50) {
              content = result[key];
              break;
            }
          }
        }

        if (content && onContentGenerated) {
          onContentGenerated("\n\n" + content);
          toast({
            title: "生成成功",
            description: "内容已生成",
          })
        } else {
          // 最后的备用方案：使用示例文本
          if (onContentGenerated) {
            onContentGenerated(
              "\n\n林逸站在山巅，俯瞰着脚下云雾缭绕的仙山。他的长袍被风吹得猎猎作响，手中的古剑散发着淡淡的青光。\n\n多年苦修，终于踏入元婴期。" +
                "林逸喃喃自语，眼中闪烁着坚定的光芒。\n\n远处，一道金光划破天际，那是宗门的紧急召集令。林逸眉头一皱，身形一闪，已化作一道流光向宗门方向飞去.",
            )
            toast({
              title: "生成失败，使用示例内容",
              description: "API返回格式不正确，已使用示例内容代替",
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      console.error("生成内容错误:", error);
      toast({
        title: "生成失败",
        description: "生成内容时发生错误: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI 辅助创作</CardTitle>
        <CardDescription>使用 AI 辅助你的创作</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="style">文风</TabsTrigger>
            <TabsTrigger value="plot">情节</TabsTrigger>
            <TabsTrigger value="character">角色</TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label>文风选择</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="选择文风" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="古风">古风</SelectItem>
                  <SelectItem value="现代">现代</SelectItem>
                  <SelectItem value="武侠">武侠</SelectItem>
                  <SelectItem value="玄幻">玄幻</SelectItem>
                  <SelectItem value="科幻">科幻</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>描写细节度</Label>
              <Slider value={[detailLevel]} onValueChange={(value) => setDetailLevel(value[0])} max={10} step={1} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>简洁</span>
                <span>详细</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>对话比例</Label>
              <Slider value={[dialogueRatio]} onValueChange={(value) => setDialogueRatio(value[0])} max={10} step={1} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>少</span>
                <span>多</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>修辞手法</Label>
              <Slider value={[rhetoricLevel]} onValueChange={(value) => setRhetoricLevel(value[0])} max={10} step={1} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>朴实</span>
                <span>华丽</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plot" className="space-y-4">
            <div className="space-y-2">
              <Label>情节类型</Label>
              <Select value={plotType} onValueChange={setPlotType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择情节类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">战斗</SelectItem>
                  <SelectItem value="adventure">冒险</SelectItem>
                  <SelectItem value="romance">感情</SelectItem>
                  <SelectItem value="mystery">悬疑</SelectItem>
                  <SelectItem value="revelation">揭示</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>情节提示</Label>
              <Textarea
                placeholder="描述你想要的情节发展..."
                value={plotPrompt}
                onChange={(e) => setPlotPrompt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>情节复杂度</Label>
              <Slider
                value={[plotComplexity]}
                onValueChange={(value) => setPlotComplexity(value[0])}
                max={10}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>简单</span>
                <span>复杂</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="character" className="space-y-4">
            <div className="space-y-2">
              <Label>角色选择</Label>
              <Select value={character} onValueChange={setCharacter}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protagonist">主角</SelectItem>
                  <SelectItem value="antagonist">反派</SelectItem>
                  <SelectItem value="supporting">配角</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>角色情绪</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger>
                  <SelectValue placeholder="选择情绪" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">喜悦</SelectItem>
                  <SelectItem value="angry">愤怒</SelectItem>
                  <SelectItem value="sad">悲伤</SelectItem>
                  <SelectItem value="fear">恐惧</SelectItem>
                  <SelectItem value="surprise">惊讶</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>角色行为提示</Label>
              <Textarea
                placeholder="描述角色的行为或反应..."
                value={characterPrompt}
                onChange={(e) => setCharacterPrompt(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="use-background"
              checked={useBackgroundInfo}
              onChange={(e) => setUseBackgroundInfo(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <Label htmlFor="use-background">使用小说背景信息辅助生成</Label>
          </div>

          {novel && useBackgroundInfo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md text-xs">
              <p className="font-medium">将使用以下背景信息：</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {novel.outline && <li>小说大纲</li>}
                {novel.characters.length > 0 && <li>{novel.characters.length} 个角色信息</li>}
                {novel.worldbuilding && <li>世界观设定</li>}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label>生成提示</Label>
            <Textarea
              placeholder="描述你想要生成的内容..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                生成内容
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
