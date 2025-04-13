"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Upload, Save, RefreshCw } from "lucide-react"

export default function StyleCustomization() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">文风定制系统</h1>

      <Tabs defaultValue="preset">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="preset">预设文风</TabsTrigger>
          <TabsTrigger value="custom">自定义文风</TabsTrigger>
          <TabsTrigger value="learn">文风学习</TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle>古风</CardTitle>
                <CardDescription>古典优雅，意境深远</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  以古典文学风格为基础，语言优美，意境深远，适合仙侠、古代背景小说。
                </p>
                <Button variant="outline" className="w-full">
                  选择
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle>现代</CardTitle>
                <CardDescription>简洁明快，节奏紧凑</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">语言简洁明快，节奏紧凑，对话生动，适合都市、现代背景小说。</p>
                <Button variant="outline" className="w-full">
                  选择
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle>武侠</CardTitle>
                <CardDescription>豪迈奔放，快意恩仇</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  风格豪迈奔放，讲究快意恩仇，武功描写细致，适合武侠、江湖背景小说。
                </p>
                <Button variant="outline" className="w-full">
                  选择
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle>玄幻</CardTitle>
                <CardDescription>想象奇特，世界宏大</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  想象力丰富，世界观宏大，修炼描写细致，适合玄幻、修真背景小说。
                </p>
                <Button variant="outline" className="w-full">
                  选择
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle>科幻</CardTitle>
                <CardDescription>逻辑严密，想象前沿</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">逻辑严密，科技感强，想象力前沿，适合科幻、未来背景小说。</p>
                <Button variant="outline" className="w-full">
                  选择
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle>悬疑</CardTitle>
                <CardDescription>扣人心弦，层层递进</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  情节扣人心弦，线索层层递进，氛围紧张，适合悬疑、推理背景小说。
                </p>
                <Button variant="outline" className="w-full">
                  选择
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>自定义文风参数</CardTitle>
              <CardDescription>调整参数定制你的专属文风</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>文风名称</Label>
                    <Input placeholder="为你的文风命名" />
                  </div>
                  <div className="space-y-2">
                    <Label>基础风格</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择基础风格" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ancient">古风</SelectItem>
                        <SelectItem value="modern">现代</SelectItem>
                        <SelectItem value="wuxia">武侠</SelectItem>
                        <SelectItem value="fantasy">玄幻</SelectItem>
                        <SelectItem value="scifi">科幻</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>句式复杂度 (1-10)</Label>
                  <Slider defaultValue={[5]} max={10} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>简单短句</span>
                    <span>复杂长句</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>修辞手法频率 (1-10)</Label>
                  <Slider defaultValue={[5]} max={10} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>少用修辞</span>
                    <span>多用修辞</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>细节描写程度 (1-10)</Label>
                  <Slider defaultValue={[5]} max={10} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>简略描写</span>
                    <span>细致描写</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>对白占比 (10%-90%)</Label>
                  <Slider defaultValue={[40]} max={90} min={10} step={5} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10%</span>
                    <span>90%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>心理描写占比 (10%-90%)</Label>
                  <Slider defaultValue={[30]} max={90} min={10} step={5} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10%</span>
                    <span>90%</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">重置</Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Save className="mr-2 h-4 w-4" />
                    保存文风
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>文风混合器</CardTitle>
              <CardDescription>混合多种风格形成独特文风</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>古风比例</Label>
                  <Slider defaultValue={[30]} max={100} step={5} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>现代比例</Label>
                  <Slider defaultValue={[20]} max={100} step={5} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>武侠比例</Label>
                  <Slider defaultValue={[50]} max={100} step={5} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">重置</Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    生成混合文风
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>文风学习</CardTitle>
              <CardDescription>上传文本样本，AI 分析并模仿其风格</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>上传文本样本</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      拖放文本文件或点击上传
                      <br />
                      <span className="text-xs">(推荐 5000-10000 字的文本样本)</span>
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      选择文件
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>或粘贴文本样本</Label>
                  <Textarea placeholder="在此粘贴文本样本..." className="min-h-[200px]" />
                </div>

                <div className="space-y-2">
                  <Label>文风名称</Label>
                  <Input placeholder="为学习的文风命名" />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      分析文风
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>已学习的文风</CardTitle>
              <CardDescription>你的文风库</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">金庸风格</h4>
                    <p className="text-sm text-gray-500">基于《射雕英雄传》学习</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">余华风格</h4>
                    <p className="text-sm text-gray-500">基于《活着》学习</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm">
                      使用
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
