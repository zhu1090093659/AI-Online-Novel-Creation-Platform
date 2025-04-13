"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Sparkles, RefreshCw } from "lucide-react"

export default function WorldBuilding() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">世界观构建系统</h1>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="basic">基础设定</TabsTrigger>
          <TabsTrigger value="power">战力体系</TabsTrigger>
          <TabsTrigger value="rules">世界规则</TabsTrigger>
          <TabsTrigger value="history">历史背景</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>世界基础设定</CardTitle>
              <CardDescription>定义你的小说世界基本信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>世界名称</Label>
                    <Input placeholder="例如：天玄大陆" />
                  </div>
                  <div className="space-y-2">
                    <Label>时代背景</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择时代背景" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ancient">远古时代</SelectItem>
                        <SelectItem value="medieval">中古时代</SelectItem>
                        <SelectItem value="modern">现代</SelectItem>
                        <SelectItem value="future">未来</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>文明发展程度</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择文明发展程度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primitive">原始文明</SelectItem>
                      <SelectItem value="agricultural">农耕文明</SelectItem>
                      <SelectItem value="industrial">工业文明</SelectItem>
                      <SelectItem value="information">信息文明</SelectItem>
                      <SelectItem value="space">星际文明</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>世界描述</Label>
                  <Textarea placeholder="描述这个世界的基本情况..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>主要种族</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">
                      人类
                    </Button>
                    <Button variant="outline" size="sm">
                      精灵
                    </Button>
                    <Button variant="outline" size="sm">
                      兽人
                    </Button>
                    <Button variant="outline" size="sm">
                      矮人
                    </Button>
                    <Button variant="outline" size="sm">
                      龙族
                    </Button>
                    <Button variant="outline" size="sm">
                      + 自定义
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成详细世界观
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>地理环境创建</CardTitle>
              <CardDescription>设计你的小说世界地理环境</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>主要地形</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">
                      平原
                    </Button>
                    <Button variant="outline" size="sm">
                      山脉
                    </Button>
                    <Button variant="outline" size="sm">
                      森林
                    </Button>
                    <Button variant="outline" size="sm">
                      沙漠
                    </Button>
                    <Button variant="outline" size="sm">
                      海洋
                    </Button>
                    <Button variant="outline" size="sm">
                      + 自定义
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>特殊地区</Label>
                  <Textarea placeholder="描述世界中的特殊地区..." className="min-h-[100px]" />
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  生成世界地图
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>战力体系设计</CardTitle>
              <CardDescription>设计你的小说战力体系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>体系类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择体系类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cultivation">修真/修仙</SelectItem>
                      <SelectItem value="martial">武道</SelectItem>
                      <SelectItem value="magic">魔法</SelectItem>
                      <SelectItem value="technology">科技</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>体系名称</Label>
                  <Input placeholder="例如：灵气修炼体系" />
                </div>

                <div className="space-y-2">
                  <Label>等级划分</Label>
                  <Textarea placeholder="描述修炼等级划分..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>体系复杂度</Label>
                  <Slider defaultValue={[7]} max={10} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>简单</span>
                    <span>复杂</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>属性系统</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">
                      金
                    </Button>
                    <Button variant="outline" size="sm">
                      木
                    </Button>
                    <Button variant="outline" size="sm">
                      水
                    </Button>
                    <Button variant="outline" size="sm">
                      火
                    </Button>
                    <Button variant="outline" size="sm">
                      土
                    </Button>
                    <Button variant="outline" size="sm">
                      + 自定义
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成完整战力体系
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>世界规则制定</CardTitle>
              <CardDescription>设计你的小说世界运行规则</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>自然法则</Label>
                  <Textarea placeholder="描述与现实世界的差异..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>社会组织结构</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择主要社会结构" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monarchy">君主制</SelectItem>
                      <SelectItem value="feudal">封建制</SelectItem>
                      <SelectItem value="republic">共和制</SelectItem>
                      <SelectItem value="sect">宗门制</SelectItem>
                      <SelectItem value="tribal">部落制</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>经济与交易系统</Label>
                  <Textarea placeholder="描述经济与交易系统..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>信仰与宗教体系</Label>
                  <Textarea placeholder="描述信仰与宗教体系..." className="min-h-[100px]" />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成完整世界规则
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>历史背景设计</CardTitle>
              <CardDescription>设计你的小说世界历史背景</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>世界年龄</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择世界年龄" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="young">年轻世界 (数百年)</SelectItem>
                      <SelectItem value="mature">成熟世界 (数千年)</SelectItem>
                      <SelectItem value="ancient">古老世界 (数万年)</SelectItem>
                      <SelectItem value="primordial">远古世界 (数十万年)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>关键历史事件</Label>
                  <Textarea placeholder="描述世界中的关键历史事件..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>历史人物</Label>
                  <Textarea placeholder="描述世界中的重要历史人物..." className="min-h-[100px]" />
                </div>

                <div className="space-y-2">
                  <Label>势力变迁</Label>
                  <Textarea placeholder="描述世界中的势力变迁..." className="min-h-[100px]" />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成历史时间线
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
