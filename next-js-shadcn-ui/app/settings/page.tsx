"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocalStorage, type UserSettings } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, ExternalLink, CheckCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    apiKey: "",
    model: "gemini-2.5-pro-preview-03-25",
    theme: "light",
    customWritingStyle: "", // 添加自定义文风字段
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false) // 添加保存成功状态
  const { toast } = useToast()

  useEffect(() => {
    // 加载设置
    const savedSettings = LocalStorage.getSettings()
    setSettings(savedSettings)
  }, [])

  const handleSave = () => {
    // 重置保存成功状态
    setSaveSuccess(false)
    // 显示保存中状态
    setIsSaving(true)

    try {
      // 保存设置
      LocalStorage.saveSettings(settings)

      // 添加延迟，增强用户体验
      setTimeout(() => {
        // 显示成功通知
        toast({
          title: "设置已保存",
          description: "您的设置已成功保存",
          variant: "success", // 使用成功样式，更明显
        })

        // 设置保存成功状态
        setSaveSuccess(true)
        // 重置保存状态
        setIsSaving(false)

        // 3秒后重置成功状态
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      }, 800) // 添加延迟，增强用户体验
    } catch (error) {
      // 显示错误通知
      toast({
        title: "保存失败",
        description: "保存设置时发生错误",
        variant: "destructive",
      })

      // 重置保存状态
      setIsSaving(false)
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
        <h1 className="text-3xl font-bold">系统设置</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API 设置</CardTitle>
          <CardDescription>配置 AI 服务的 API 密钥和模型</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API 密钥</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="输入您的 API 密钥"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            />
            <div className="flex items-center text-sm text-muted-foreground">
              <p className="mr-2">没有 API 密钥？</p>
              <a
                href="https://api.sakis.top"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:underline"
              >
                点击购买 <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI 模型</Label>
            <Select value={settings.model} onValueChange={(value) => setSettings({ ...settings, model: value })}>
              <SelectTrigger id="model">
                <SelectValue placeholder="选择 AI 模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-pro-preview-03-25">Gemini 2.5 Pro (推荐)</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">选择用于生成内容的 AI 模型，不同模型有不同的能力和价格</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customWritingStyle">自定义文风</Label>
            <Input
              id="customWritingStyle"
              placeholder="例如：古风、现代、湿潮、简洁、详尽、幽默、浪漫等"
              value={settings.customWritingStyle}
              onChange={(e) => setSettings({ ...settings, customWritingStyle: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">设置默认的文风，将应用于生成的内容。留空则使用系统默认文风</p>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-md">
            <h3 className="text-sm font-medium text-purple-800 mb-2">关于 API 服务</h3>
            <p className="text-sm text-purple-700 mb-2">
              本应用使用 Sakis API 服务提供 AI 能力。所有数据均存储在您的浏览器本地，API 请求直接从您的浏览器发送到
              Sakis API 服务。
            </p>
            <p className="text-sm text-purple-700">
              API 基础 URL: <span className="font-mono">https://api.sakis.top/v1</span>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full transition-colors duration-300 ${isSaving
              ? 'bg-blue-600 hover:bg-blue-700'
              : saveSuccess
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                保存成功
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
