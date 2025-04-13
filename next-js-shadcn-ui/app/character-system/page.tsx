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
import { Sparkles, RefreshCw, Users } from "lucide-react"

export default function CharacterSystem() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">角色系统</h1>

      <Tabs defaultValue="create">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="create">角色创建</TabsTrigger>
          <TabsTrigger value="relationship">角色关系</TabsTrigger>
          <TabsTrigger value="growth">角色成长</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>角色卡片生成器</CardTitle>
                <CardDescription>创建你的小说角色</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>角色名称</Label>
                    <Input placeholder="输入角色名称" />
                  </div>

                  <div className="space-y-2">
                    <Label>角色定位</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色定位" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="protagonist">主角</SelectItem>
                        <SelectItem value="antagonist">反派</SelectItem>
                        <SelectItem value="supporting">配角</SelectItem>
                        <SelectItem value="mentor">导师</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>年龄</Label>
                    <Input type="number" placeholder="输入角色年龄" />
                  </div>

                  <div className="space-y-2">
                    <Label>性别</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>身份/职业</Label>
                    <Input placeholder="例如：修仙者、侠客、商人" />
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
                        生成角色卡片
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>角色详细设定</CardTitle>
                <CardDescription>定制角色的详细信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>外貌特征</Label>
                    <Textarea placeholder="描述角色的外貌特征..." />
                  </div>

                  <div className="space-y-2">
                    <Label>性格特点</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">
                        勇敢
                      </Button>
                      <Button variant="outline" size="sm">
                        谨慎
                      </Button>
                      <Button variant="outline" size="sm">
                        聪明
                      </Button>
                      <Button variant="outline" size="sm">
                        固执
                      </Button>
                      <Button variant="outline" size="sm">
                        善良
                      </Button>
                      <Button variant="outline" size="sm">
                        + 自定义
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>能力天赋</Label>
                    <Textarea placeholder="描述角色的能力和天赋..." />
                  </div>

                  <div className="space-y-2">
                    <Label>背景故事</Label>
                    <Textarea placeholder="描述角色的背景故事..." className="min-h-[100px]" />
                  </div>

                  <div className="space-y-2">
                    <Label>动机与目标</Label>
                    <Textarea placeholder="描述角色的动机与目标..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>角色列表</CardTitle>
              <CardDescription>已创建的角色</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">林</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">林逸</h4>
                    <p className="text-sm text-gray-500">主角 · 修仙者</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-600 font-bold">莫</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">莫天行</h4>
                    <p className="text-sm text-gray-500">反派 · 魔教教主</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">云</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">云霄</h4>
                    <p className="text-sm text-gray-500">配角 · 仙门长老</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationship" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>角色关系图</CardTitle>
              <CardDescription>可视化展示小说人物关系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4 h-[400px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">角色关系图将在这里显示</p>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成关系图
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>创建角色关系</CardTitle>
              <CardDescription>定义角色之间的关系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>角色 A</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character1">林逸</SelectItem>
                        <SelectItem value="character2">莫天行</SelectItem>
                        <SelectItem value="character3">云霄</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>角色 B</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character1">林逸</SelectItem>
                        <SelectItem value="character2">莫天行</SelectItem>
                        <SelectItem value="character3">云霄</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>关系类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择关系类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">家族关系</SelectItem>
                      <SelectItem value="friend">朋友关系</SelectItem>
                      <SelectItem value="enemy">敌对关系</SelectItem>
                      <SelectItem value="lover">恋人关系</SelectItem>
                      <SelectItem value="master">师徒关系</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>关系描述</Label>
                  <Textarea placeholder="描述两个角色之间的关系..." />
                </div>

                <div className="space-y-2">
                  <Label>关系强度</Label>
                  <Slider defaultValue={[7]} max={10} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>弱</span>
                    <span>强</span>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  添加关系
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>角色成长规划</CardTitle>
              <CardDescription>设计角色发展路线和关键转折点</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>选择角色</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="character1">林逸</SelectItem>
                      <SelectItem value="character2">莫天行</SelectItem>
                      <SelectItem value="character3">云霄</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>成长目标</Label>
                  <Textarea placeholder="描述角色的最终成长目标..." />
                </div>

                <div className="space-y-2">
                  <Label>关键转折点</Label>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">转折点 1</h4>
                        <Button variant="ghost" size="sm">
                          编辑
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">初入修仙界，获得传承</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">转折点 2</h4>
                        <Button variant="ghost" size="sm">
                          编辑
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">遭遇大敌，险些丧命</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      + 添加转折点
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>能力进阶规划</Label>
                  <Textarea placeholder="描述角色的能力进阶路线..." />
                </div>

                <div className="space-y-2">
                  <Label>性格转变触发条件</Label>
                  <Textarea placeholder="描述可能导致角色性格转变的条件..." />
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
                      生成完整成长路线
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
