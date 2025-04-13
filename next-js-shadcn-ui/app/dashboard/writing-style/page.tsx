import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Brush, Upload, MoveHorizontalIcon as MixerHorizontal, Save, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "文风定制 | AI 网络小说创作平台",
  description: "定制您的写作风格，创建独特的文风",
}

export default function WritingStylePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="文风定制系统" description="定制您的写作风格，创建独特的文风" />

      <Tabs defaultValue="preset-styles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preset-styles">预设文风</TabsTrigger>
          <TabsTrigger value="style-learning">文风学习</TabsTrigger>
          <TabsTrigger value="style-mixing">混合文风</TabsTrigger>
          <TabsTrigger value="style-parameters">文风参数</TabsTrigger>
        </TabsList>

        <TabsContent value="preset-styles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>预设文风模板</CardTitle>
              <CardDescription>选择预设的文风模板，快速应用到您的创作中</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StyleCard
                  title="古风"
                  description="典雅古韵，文言与白话结合，适合古代背景小说"
                  example="青山隐隐，流水潺潺。远处楼阁依稀可见，如梦似幻。"
                />
                <StyleCard
                  title="现代简洁"
                  description="简洁明快，语言精炼，适合都市类小说"
                  example="他快步走过马路，钻进咖啡馆。窗外的雨下个不停，就像他的心情。"
                />
                <StyleCard
                  title="武侠风"
                  description="豪迈飘逸，武功招式描写细腻，适合武侠小说"
                  example="剑气纵横三万里，一剑光寒十九州。他手中长剑一挥，风云为之变色。"
                />
                <StyleCard
                  title="玄幻奇幻"
                  description="想象丰富，术语专业，适合玄幻奇幻类小说"
                  example="灵力如潮水般涌动，九天神雷在他掌心凝聚，化作毁天灭地之力。"
                />
                <StyleCard
                  title="悬疑推理"
                  description="线索铺陈，节奏紧凑，适合悬疑推理类小说"
                  example="房间里一片寂静，只有钟表的滴答声。他注意到地毯上那几乎不可见的脚印。"
                />
                <StyleCard
                  title="科幻未来"
                  description="科技感强，概念前卫，适合科幻类小说"
                  example="量子计算机启动了意识上传程序，他的思维在数字宇宙中展开，成为永恒。"
                />
                <StyleCard
                  title="青春校园"
                  description="活泼轻快，对白生动，适合青春校园类小说"
                  example="阳光透过教室的窗户洒在课桌上，她偷偷瞄了他一眼，迅速低下头。"
                />
                <StyleCard
                  title="半文半白"
                  description="文言与白话混合，古今结合，独特韵味"
                  example="彼时天色已晚，他独自一人走在回家的路上，心中思绪万千。"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style-learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文风学习</CardTitle>
              <CardDescription>上传您喜欢的作品样本，AI 将分析并模仿其风格</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="style-name">文风名称</Label>
                <Input id="style-name" placeholder="为您的文风取一个名字" />
              </div>

              <div className="space-y-2">
                <Label>上传文本样本</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">拖放文本文件或点击上传</p>
                  <p className="text-xs text-muted-foreground">建议上传 5000-10000 字的文本样本</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    选择文件
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample-text">或直接粘贴文本样本</Label>
                <Textarea id="sample-text" placeholder="粘贴您喜欢的作品片段，AI 将分析其风格特点" rows={8} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Brush className="mr-2 h-4 w-4" />
                分析文风
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="style-mixing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>混合文风创建</CardTitle>
              <CardDescription>结合多种风格形成独特文风</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mixed-style-name">混合文风名称</Label>
                <Input id="mixed-style-name" placeholder="为您的混合文风取一个名字" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>古风</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[30]} max={100} min={0} step={5} className="w-[200px]" />
                    <span className="w-12 text-right text-sm">30%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>现代简洁</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[40]} max={100} min={0} step={5} className="w-[200px]" />
                    <span className="w-12 text-right text-sm">40%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>武侠风</Label>
                  <div className="flex items-center gap-2">
                    <Slider defaultValue={[30]} max={100} min={0} step={5} className="w-[200px]" />
                    <span className="w-12 text-right text-sm">30%</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="mt-2">
                  <MixerHorizontal className="mr-2 h-4 w-4" />
                  添加更多风格
                </Button>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="mixed-style-preview">混合文风预览</Label>
                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm">
                    青山隐隐，流水潺潺。他快步穿过古老的街道，钻进一家茶馆。窗外的雨下个不停，就像他翻腾的心绪。剑气在他体内流转，如有实质。
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                保存混合文风
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="style-parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文风参数微调</CardTitle>
              <CardDescription>调整文风的具体参数，精确控制写作风格</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-style">基础文风</Label>
                <Select defaultValue="modern">
                  <SelectTrigger id="base-style">
                    <SelectValue placeholder="选择基础文风" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ancient">古风</SelectItem>
                    <SelectItem value="modern">现代简洁</SelectItem>
                    <SelectItem value="wuxia">武侠风</SelectItem>
                    <SelectItem value="fantasy">玄幻奇幻</SelectItem>
                    <SelectItem value="mystery">悬疑推理</SelectItem>
                    <SelectItem value="scifi">科幻未来</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>句式复杂度</Label>
                    <span className="text-sm text-muted-foreground">6/10</span>
                  </div>
                  <Slider defaultValue={[6]} max={10} min={1} step={1} />
                  <p className="text-xs text-muted-foreground">值越高，句子结构越复杂，使用的从句和修饰语越多</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>修辞手法频率</Label>
                    <span className="text-sm text-muted-foreground">7/10</span>
                  </div>
                  <Slider defaultValue={[7]} max={10} min={1} step={1} />
                  <p className="text-xs text-muted-foreground">值越高，使用的比喻、拟人等修辞手法越多</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>细节描写程度</Label>
                    <span className="text-sm text-muted-foreground">8/10</span>
                  </div>
                  <Slider defaultValue={[8]} max={10} min={1} step={1} />
                  <p className="text-xs text-muted-foreground">值越高，场景和人物描写越细致</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>对白占比</Label>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                  <Slider defaultValue={[40]} max={90} min={10} step={5} />
                  <p className="text-xs text-muted-foreground">调整对话在文章中的比例</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>心理描写占比</Label>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <Slider defaultValue={[30]} max={90} min={10} step={5} />
                  <p className="text-xs text-muted-foreground">调整角色内心活动描写的比例</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="style-preview">文风预览</Label>
                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm">
                    雨水顺着窗棂滑落，如同无数细小的银蛇。李明望着窗外模糊的街景，思绪如同那雨水般纷乱。"我不该来的。"他低声自语，手指无意识地敲打着桌面。咖啡的香气在狭小的空间里弥漫，与雨水的清冽混合在一起，形成一种奇特的氛围。
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                保存文风设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>我的文风库</CardTitle>
            <CardDescription>查看和管理您保存的文风</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">古今交融</h4>
                  <p className="text-sm text-muted-foreground">混合文风 · 古风(40%) + 现代(60%)</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    编辑
                  </Button>
                  <Button size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    应用
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">金庸风格</h4>
                  <p className="text-sm text-muted-foreground">学习文风 · 基于《天龙八部》</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    编辑
                  </Button>
                  <Button size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    应用
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">科幻简洁</h4>
                  <p className="text-sm text-muted-foreground">参数文风 · 基于科幻未来</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    编辑
                  </Button>
                  <Button size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    应用
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

function StyleCard({
  title,
  description,
  example,
}: {
  title: string
  description: string
  example: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="p-3 rounded bg-muted text-sm italic">"{example}"</div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full">
          应用此文风
        </Button>
      </CardFooter>
    </Card>
  )
}
