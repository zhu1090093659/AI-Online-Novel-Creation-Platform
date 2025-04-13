"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BookOpen, MessageSquare, ThumbsUp, Users } from "lucide-react"

export default function Community() {
  const [activeTab, setActiveTab] = useState("works")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">创作社区</h1>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="works">作品广场</TabsTrigger>
            <TabsTrigger value="fanfic">同人创作</TabsTrigger>
            <TabsTrigger value="challenges">创作挑战</TabsTrigger>
            <TabsTrigger value="groups">创作圈子</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Input placeholder="搜索作品、作者或标签..." className="pl-10" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      <TabsContent value="works" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>玄天剑尊</CardTitle>
                    <CardDescription>玄幻 · 东方玄幻</CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">墨</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-3">
                  少年林逸意外获得上古剑修传承，从此踏上修仙之路。在这个充满危机与机遇的世界，他将如何成长为一代剑尊？
                </p>
                <div className="flex items-center mt-4 text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  <span>12.5万人在读</span>
                  <span className="mx-2">•</span>
                  <BookOpen className="h-3 w-3 mr-1" />
                  <span>共32章</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>426</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>128</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  阅读
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="fanfic" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>斗破苍穹外传</CardTitle>
                    <CardDescription>同人 · 原著：斗破苍穹</CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">青</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-3">
                  如果萧炎没有遇到药老，他的命运会如何发展？本文探索了一个全新的可能性...
                </p>
                <div className="flex items-center mt-4 text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  <span>5.2万人在读</span>
                  <span className="mx-2">•</span>
                  <BookOpen className="h-3 w-3 mr-1" />
                  <span>共18章</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>326</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>98</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  阅读
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="challenges" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>四月创作挑战赛</CardTitle>
              <CardDescription>主题：平行世界</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                创作一个发生在平行世界的短篇小说，字数不少于5000字。最佳作品将获得平台推荐位展示。
              </p>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium">参与人数：</span>
                <span className="ml-1">328</span>
                <span className="mx-2">•</span>
                <span className="font-medium">剩余时间：</span>
                <span className="ml-1">5天</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">参与挑战</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>角色塑造大赛</CardTitle>
              <CardDescription>主题：反派洗白</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                创作一个反派洗白的故事，展示角色的转变过程。字数不少于8000字。获胜者将获得专业编辑一对一指导。
              </p>
              <div className="mt-4 flex items-center text-sm">
                <span className="font-medium">参与人数：</span>
                <span className="ml-1">156</span>
                <span className="mx-2">•</span>
                <span className="font-medium">剩余时间：</span>
                <span className="ml-1">12天</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">参与挑战</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="groups" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>玄幻创作交流群</CardTitle>
              <CardDescription>成员：1,256</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">专注于玄幻小说创作的交流群，讨论世界观构建、修炼体系设计等话题。</p>
              <div className="mt-4 flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                  >
                    {item}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                  +1.2k
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                加入圈子
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>武侠江湖</CardTitle>
              <CardDescription>成员：876</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">武侠小说爱好者的聚集地，讨论武功设计、江湖规则、人物塑造等话题。</p>
              <div className="mt-4 flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                  >
                    {item}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                  +872
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                加入圈子
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>科幻未来</CardTitle>
              <CardDescription>成员：652</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">科幻小说创作交流群，讨论科技设定、未来世界构建、外星文明等话题。</p>
              <div className="mt-4 flex -space-x-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                  >
                    {item}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                  +648
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                加入圈子
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </div>
  )
}
