import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Feather, Globe, Users, Wand2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                AI 网络小说创作平台
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                用 AI 释放你的创作潜能，打造属于你的文学世界
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  开始创作 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline">了解更多</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">平台特色</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                全方位的 AI 辅助创作工具，让你的小说创作更加高效
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Wand2 className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">AI 辅助创作</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                根据你的想法生成完整章节，支持多种小说类型和写作风格
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Feather className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">文风定制系统</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                多种预设文风模板，文风学习功能，混合文风创建，参数微调
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Globe className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">世界观构建</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                世界观生成器，战力体系设计，规则体系生成，历史背景设计
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Users className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">角色系统</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                角色卡片生成，角色关系图，角色成长规划，性格特点定制
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <BookOpen className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">情节构建</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                主线生成，支线副本生成，情节冲突设计，伏笔与悬念布置
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
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
                className="h-12 w-12 text-purple-600"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <h3 className="text-xl font-bold">物品与技能系统</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                技能生成器，武器装备生成，奇珍异宝设计，道具成长系统
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">开始你的创作之旅</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                立即注册，体验 AI 辅助创作的魅力
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button className="bg-purple-600 hover:bg-purple-700">免费注册</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">登录</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
