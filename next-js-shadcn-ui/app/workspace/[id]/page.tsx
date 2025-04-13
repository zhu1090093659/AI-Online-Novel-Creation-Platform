"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { BookOpen, Save, Wand2, Sparkles, RefreshCw, GitBranch, Globe, Users, Sword, Plus, Trash2 } from "lucide-react"
import WorkspaceHeader from "@/components/workspace-header"
import AIGenerationPanel from "@/components/ai-generation-panel"
import { LocalStorage, type Novel, type Chapter } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { DeleteChapterDialog } from "@/components/delete-chapter-dialog"

export default function Workspace() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const novelId = params.id as string

  const [novel, setNovel] = useState<Novel | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [content, setContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chapterToDelete, setChapterToDelete] = useState<{id: string, title: string} | null>(null)

  // 加载小说和章节
  useEffect(() => {
    const loadNovelData = () => {
      if (!novelId) return

      setIsLoading(true)
      try {
        // 加载小说信息
        const novelData = LocalStorage.getNovelById(novelId)
        if (!novelData) {
          toast({
            title: "小说不存在",
            description: "找不到指定的小说",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setNovel(novelData)

        // 如果有章节，加载第一章
        if (novelData.chapters.length > 0) {
          setCurrentChapter(novelData.chapters[0])
          setContent(novelData.chapters[0].content || "")
        }
      } catch (error) {
        console.error("加载小说数据失败:", error)
        toast({
          title: "加载失败",
          description: "加载小说数据时发生错误",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadNovelData()
  }, [novelId, router, toast])

  const handleGenerate = async () => {
    if (!novel || !currentChapter) return

    setIsGenerating(true)
    try {
      // 获取前面所有章节的概要，用于提供上下文
      let previousChaptersSummaries = "";

      // 按章节顺序排序，只考虑当前章节之前的章节
      const previousChapters = novel.chapters
        .filter(ch => ch.order_index < currentChapter.order_index)
        .sort((a, b) => a.order_index - b.order_index);

      if (previousChapters.length > 0) {
        // 收集所有前面章节的概要
        previousChaptersSummaries = previousChapters.map((chapter, index) => {
          // 如果章节有概要，使用概要，否则生成一个简单的概要
          let chapterSummary = chapter.summary;
          if (!chapterSummary && chapter.content) {
            const content = chapter.content.trim();
            chapterSummary = content.length > 150 ? content.substring(0, 150) + "..." : content;
          }

          return chapterSummary ? `第${index + 1}章【${chapter.title}】: ${chapterSummary}` : "";
        }).filter(Boolean).join("\n\n");
      }

      // 构建提示，包含小说信息、前面所有章节的概要和当前内容
      const prompt = `请为我的小说《${novel.title}》生成一段内容。小说类型是${novel.genre}。当前章节是《${currentChapter.title}》。

${previousChaptersSummaries ? `前面章节概要：
${previousChaptersSummaries}

` : ""}当前章节内容：
${content.slice(-500)}

请继续生成接下来的内容，保持连贯和一致性。如果当前内容中有【前文概要】标记，请忽略该标记和概要内容，只基于实际的小说内容继续创作。`;

      console.log('生成提示:', prompt);

      // 使用ApiService生成内容
      const result = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: "chapter",
          style: novel.genre === "仙侠" || novel.genre === "玄幻" ? "古风" : "现代",
        }),
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || '生成内容失败');
      }

      // 读取流式响应
      const reader = result.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let generatedContent = '';
      let decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        generatedContent += chunk;

        // 实时更新内容
        setContent(prevContent => prevContent + chunk);
      }

      toast({
        title: "生成成功",
        description: "内容已生成",
      });
    } catch (error) {
      console.error('生成内容错误:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "生成内容时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = async () => {
    return new Promise<boolean>((resolve) => {
      if (!novel || !currentChapter) {
        resolve(false);
        return;
      }

      // 显示保存状态
      setIsSaving(true)

      try {
        // 生成章节概要
        let summary = "";
        if (content.trim()) {
          // 如果内容超过500字，取前200字 + 中间100字 + 后200字作为概要
          const trimmedContent = content.trim();
          if (trimmedContent.length > 500) {
            const firstPart = trimmedContent.substring(0, 200);
            const middlePart = trimmedContent.substring(Math.floor(trimmedContent.length / 2) - 50, Math.floor(trimmedContent.length / 2) + 50);
            const lastPart = trimmedContent.substring(trimmedContent.length - 200);
            summary = `${firstPart}...(${middlePart})...${lastPart}`;
          } else {
            summary = trimmedContent;
          }
        }

        // 更新章节内容
        const updatedChapter = {
          ...currentChapter,
          content,
          summary,
          updated_at: new Date().toISOString(),
        }

        // 更新小说对象中的章节
        const updatedChapters = novel.chapters.map((ch) => (ch.id === currentChapter.id ? updatedChapter : ch))

        const updatedNovel = {
          ...novel,
          chapters: updatedChapters,
          updated_at: new Date().toISOString(),
        }

        // 保存到本地存储
        console.log('正在保存小说数据...', updatedNovel.id);
        LocalStorage.saveNovel(updatedNovel)

        // 更新状态
        setNovel(updatedNovel)
        setCurrentChapter(updatedChapter)

        // 添加延迟，使用户能看到保存中的状态
        setTimeout(() => {
          // 显示成功通知，更明显的提示
          toast({
            title: "保存成功",
            description: "内容已成功保存到章节列表",
            variant: "success",
          })

          // 重置保存状态
          setIsSaving(false)

          // 高亮章节列表中的当前章节，吸引用户注意
          const chapterElement = document.getElementById(`chapter-${currentChapter.id}`);
          if (chapterElement) {
            chapterElement.classList.add('bg-green-100');
            setTimeout(() => {
              chapterElement.classList.remove('bg-green-100');
            }, 2000);
          }

          // 解析Promise，返回成功
          resolve(true);
        }, 500);

      } catch (error) {
        console.error('保存内容错误:', error);

        toast({
          title: "保存失败",
          description: error instanceof Error ? error.message : "保存内容时发生错误",
          variant: "destructive",
        })

        setIsSaving(false)
        resolve(false);
      }
    });
  }

  const handleDeleteChapter = (chapterId: string) => {
    if (!novel) return;

    // 找到要删除的章节
    const chapter = novel.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    // 打开确认对话框
    setChapterToDelete({ id: chapterId, title: chapter.title });
    setDeleteDialogOpen(true);
  }

  const confirmDeleteChapter = () => {
    if (!novel || !chapterToDelete) return;

    try {
      const chapterId = chapterToDelete.id;
      const chapterTitle = chapterToDelete.title;

      // 如果要删除的是当前章节，切换到另一个章节
      let nextChapter = null;
      if (currentChapter?.id === chapterId) {
        // 尝试找到下一个章节，如果没有，则找上一个章节
        const currentIndex = novel.chapters.findIndex(ch => ch.id === chapterId);
        if (currentIndex < novel.chapters.length - 1) {
          nextChapter = novel.chapters[currentIndex + 1];
        } else if (currentIndex > 0) {
          nextChapter = novel.chapters[currentIndex - 1];
        }
      }

      // 更新小说对象，移除要删除的章节
      const updatedChapters = novel.chapters.filter(ch => ch.id !== chapterId);

      const updatedNovel = {
        ...novel,
        chapters: updatedChapters,
        updated_at: new Date().toISOString(),
      };

      // 保存到本地存储
      LocalStorage.saveNovel(updatedNovel);

      // 更新状态
      setNovel(updatedNovel);

      // 如果删除的是当前章节，切换到下一个章节
      if (currentChapter?.id === chapterId) {
        if (nextChapter) {
          setCurrentChapter(nextChapter);
          setContent(nextChapter.content || "");
        } else {
          // 如果没有其他章节了，清空当前章节和内容
          setCurrentChapter(null);
          setContent("");
        }
      }

      toast({
        title: "删除成功",
        description: `章节 "${chapterTitle}" 已被删除`,
        variant: "success",
      });

      // 关闭对话框
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
    } catch (error) {
      console.error('删除章节错误:', error);
      toast({
        title: "删除失败",
        description: "删除章节时发生错误",
        variant: "destructive",
      });

      // 关闭对话框
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
    }
  };

  const handleChapterChange = (chapterId: string) => {
    if (!novel) return

    const chapter = novel.chapters.find((ch) => ch.id === chapterId)
    if (chapter) {
      setCurrentChapter(chapter)
      setContent(chapter.content || "")
    }
  }

  const handleContinueNextChapter = async () => {
    if (!novel || !currentChapter) return;

    try {
      // 先保存当前章节
      await handleSaveContent();

      // 创建新章节（包含前面所有章节的概要）
      const newChapterId = await handleCreateChapter(true, true);

      if (newChapterId) {
        // 获取新创建的章节
        const newChapter = novel.chapters.find(ch => ch.id === newChapterId);
        if (!newChapter) {
          throw new Error('新章节创建失败');
        }

        // 自动生成新章节内容
        setIsGenerating(true);

        // 清空编辑器中的概要内容，只保留纯生成内容
        setContent("");

        try {
          // 获取前面所有章节的概要
          const previousChapters = novel.chapters
            .sort((a, b) => a.order_index - b.order_index);

          let previousChaptersSummaries = "";
          if (previousChapters.length > 0) {
            previousChaptersSummaries = previousChapters.map((chapter, index) => {
              let chapterSummary = chapter.summary;
              if (!chapterSummary && chapter.content) {
                const content = chapter.content.trim();
                chapterSummary = content.length > 150 ? content.substring(0, 150) + "..." : content;
              }

              return chapterSummary ? `第${index + 1}章【${chapter.title}】: ${chapterSummary}` : "";
            }).filter(Boolean).join("\n\n");
          }

          // 构建简单的提示
          const prompt = `请为我的小说《${novel.title}》创作下一章的内容。小说类型是${novel.genre}。

前面章节概要：
${previousChaptersSummaries}

请创作新的一章，保持故事的连贯性和一致性，推动情节发展。`;

          console.log('续写下一章提示:', prompt);

          // 调用API生成内容
          console.log('开始调用API生成内容...');
          const result = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              type: "chapter",
              style: novel.genre === "仙侠" || novel.genre === "玄幻" ? "古风" : "现代",
            }),
          });

          console.log('API响应状态:', result.status, result.statusText);

          if (!result.ok) {
            let errorMessage = '生成内容失败';
            try {
              const errorData = await result.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              console.error('解析错误响应失败:', e);
            }
            throw new Error(errorMessage);
          }

          // 检查响应类型
          const contentType = result.headers.get('content-type');
          console.log('响应内容类型:', contentType);

          if (contentType && contentType.includes('application/json')) {
            // 如果是JSON响应，直接解析
            const jsonData = await result.json();
            console.log('收到JSON响应:', jsonData);

            if (jsonData.error) {
              throw new Error(jsonData.error);
            }

            const content = jsonData.content || jsonData.text || '';
            setContent(content);

            // 保存生成的内容
            const saveResult = await handleSaveContent();

            if (saveResult) {
              // 滚动到编辑器顶部，方便用户查看生成的内容
              const editorElement = document.querySelector('.flex-1.min-h-0.focus-visible\\:ring-0');
              if (editorElement) {
                editorElement.scrollTop = 0;
              }

              toast({
                title: "续写成功",
                description: "已自动创建并生成下一章内容",
                variant: "success",
              });
            } else {
              toast({
                title: "生成成功但保存失败",
                description: "请手动保存生成的内容",
                variant: "warning",
              });
            }

            return;
          }

          // 读取流式响应
          console.log('开始读取流式响应...');
          const reader = result.body?.getReader();
          if (!reader) {
            throw new Error('无法读取响应流');
          }

          let generatedContent = '';
          let decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              console.log('收到数据块:', chunk.length > 50 ? chunk.substring(0, 50) + '...' : chunk);
              generatedContent += chunk;

              // 实时更新内容
              setContent(prevContent => prevContent + chunk);
            }
            console.log('流式响应读取完成，总长度:', generatedContent.length);
          } catch (readError) {
            console.error('读取流式响应错误:', readError);
            throw new Error('读取生成内容时发生错误: ' + readError.message);
          }

          // 保存生成的内容
          const saveResult = await handleSaveContent();

          if (saveResult) {
            // 滚动到编辑器顶部，方便用户查看生成的内容
            const editorElement = document.querySelector('.flex-1.min-h-0.focus-visible\\:ring-0');
            if (editorElement) {
              editorElement.scrollTop = 0;
            }

            toast({
              title: "续写成功",
              description: "已自动创建并生成下一章内容",
              variant: "success",
            });
          } else {
            toast({
              title: "生成成功但保存失败",
              description: "请手动保存生成的内容",
              variant: "warning",
            });
          }
        } catch (error) {
          console.error('生成下一章内容错误:', error);

          // 尝试获取更详细的错误信息
          let errorMessage = error instanceof Error ? error.message : "生成下一章内容时发生错误";

          // 显示更友好的错误提示
          toast({
            title: "生成失败",
            description: errorMessage,
            variant: "destructive",
          });

          // 如果是API调用错误，尝试使用备用提示重试
          if (errorMessage.includes('API') || errorMessage.includes('调用') || errorMessage.includes('响应')) {
            toast({
              title: "提示",
              description: "您可以点击保存按钮保存当前内容，然后手动创建新章节",
              variant: "default",
            });
          }
        } finally {
          setIsGenerating(false);
        }
      }
    } catch (error) {
      console.error('续写下一章错误:', error);
      toast({
        title: "续写失败",
        description: "创建下一章时发生错误",
        variant: "destructive",
      });
    }
  };

  const handleCreateChapter = async (includeContext = true, switchToNewChapter = true) => {
    if (!novel) return null;

    try {
      const now = new Date().toISOString()
      const newIndex = novel.chapters.length + 1

      // 获取前面所有章节的概要，用于上下文连贯
      let previousChaptersSummaries = "";
      if (includeContext && novel.chapters.length > 0) {
        // 按章节顺序排序
        const sortedChapters = [...novel.chapters].sort((a, b) => a.order_index - b.order_index);

        // 收集所有章节的概要
        previousChaptersSummaries = sortedChapters.map((chapter, index) => {
          // 如果章节有概要，使用概要，否则生成一个简单的概要
          let chapterSummary = chapter.summary;
          if (!chapterSummary && chapter.content) {
            const content = chapter.content.trim();
            chapterSummary = content.length > 200 ? content.substring(0, 200) + "..." : content;
          }

          return chapterSummary ? `第${index + 1}章【${chapter.title}】: ${chapterSummary}` : "";
        }).filter(Boolean).join("\n\n");
      }

      // 创建新章节
      const newChapter: Chapter = {
        id: LocalStorage.generateId(),
        novel_id: novel.id,
        title: `第${newIndex}章`,
        content: previousChaptersSummaries ? `【前文概要】
${previousChaptersSummaries}

` : "",
        order_index: newIndex,
        created_at: now,
        updated_at: now,
        previous_chapter_id: novel.chapters.length > 0 ? novel.chapters[novel.chapters.length - 1].id : null,
      }

      // 更新小说对象
      const updatedNovel = {
        ...novel,
        chapters: [...novel.chapters, newChapter],
        updated_at: now,
      }

      // 保存到本地存储
      LocalStorage.saveNovel(updatedNovel)

      // 更新状态
      setNovel(updatedNovel)

      // 如果需要切换到新章节，则更新当前章节和内容
      if (switchToNewChapter) {
        // 先设置当前章节，再设置内容，确保状态一致
        setCurrentChapter(newChapter)
        setContent(newChapter.content || "")

        // 滚动到章节列表中的新章节
        setTimeout(() => {
          const chapterElement = document.getElementById(`chapter-${newChapter.id}`);
          if (chapterElement) {
            chapterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            chapterElement.classList.add('bg-green-100');
            setTimeout(() => {
              chapterElement.classList.remove('bg-green-100');
            }, 2000);
          }
        }, 100);

        toast({
          title: "创建成功",
          description: "新章节已创建" + (previousChaptersSummaries ? "，并包含了前面所有章节的概要" : ""),
          variant: "success",
        })
      }

      // 返回新章节的ID
      return newChapter.id;
    } catch (error) {
      console.error('创建章节错误:', error);
      toast({
        title: "创建失败",
        description: "创建章节时发生错误",
        variant: "destructive",
      })
      return null;
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 flex justify-center items-center min-h-screen">
        <p>加载中...</p>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="container mx-auto py-4 flex justify-center items-center min-h-screen">
        <p>小说不存在</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 flex flex-col h-screen">
      {/* 删除章节确认对话框 */}
      {deleteDialogOpen && chapterToDelete && (
        <DeleteChapterDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setChapterToDelete(null);
          }}
          onConfirm={confirmDeleteChapter}
          chapterTitle={chapterToDelete.title}
        />
      )}

      <WorkspaceHeader novel={novel} />

      <div className="flex-1 flex mt-4 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="editor" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                编辑器
              </TabsTrigger>
              <TabsTrigger value="world" className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                世界观
              </TabsTrigger>
              <TabsTrigger value="characters" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                角色
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center">
                <Sword className="mr-2 h-4 w-4" />
                物品技能
              </TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Link href={`/branch-management?novelId=${novelId}`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <GitBranch className="mr-2 h-4 w-4" />
                  分支管理
                </Button>
              </Link>
              <div className="flex space-x-2">
                <Button
                  variant={isSaving ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center ${isSaving ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={handleSaveContent}
                  disabled={isSaving || !currentChapter}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      保存
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-purple-50 hover:bg-purple-100 border-purple-200"
                  onClick={handleContinueNextChapter}
                  disabled={isGenerating || isSaving || !currentChapter}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      续写下一章
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="editor" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
              <div className="col-span-1 overflow-auto">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">章节列表</CardTitle>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const includeContext = window.confirm('是否包含前一章节的概要？');
                            handleCreateChapter(includeContext);
                          }}
                          className="h-8 w-8 p-0"
                          title="创建新章节"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      {novel.chapters.length > 0 ? (
                        novel.chapters.map((chapter) => (
                          <div key={chapter.id} className="mb-2 relative group">
                            <div className="flex">
                              <Button
                                id={`chapter-${chapter.id}`}
                                variant={currentChapter?.id === chapter.id ? "default" : "ghost"}
                                className={`w-full justify-start text-left ${currentChapter?.id === chapter.id ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}`}
                                size="sm"
                                onClick={() => handleChapterChange(chapter.id)}
                              >
                                {chapter.title}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChapter(chapter.id);
                                }}
                                title="删除章节"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            {chapter.summary && (
                              <div className="text-xs text-gray-500 mt-1 ml-2 line-clamp-2">
                                {chapter.summary.length > 100 ? chapter.summary.substring(0, 100) + "..." : chapter.summary}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>暂无章节</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              const includeContext = window.confirm('是否包含前一章节的概要？');
                              handleCreateChapter(includeContext);
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            创建章节
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-2 flex flex-col">
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {currentChapter ? currentChapter.title : "新章节"}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant={isSaving ? "default" : "outline"}
                          size="sm"
                          onClick={handleSaveContent}
                          disabled={isSaving || !currentChapter}
                          className={isSaving ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                              保存中...
                            </>
                          ) : (
                            <>
                              <Save className="mr-1 h-3 w-3" />
                              保存
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleContinueNextChapter}
                          disabled={isGenerating || isSaving || !currentChapter}
                          className="bg-purple-50 hover:bg-purple-100 border-purple-200"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <BookOpen className="mr-1 h-3 w-3" />
                              续写下一章
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden flex">
                    <div className="flex-1 min-h-0 flex flex-col">
                      <Textarea
                        className="flex-1 min-h-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                        placeholder="开始你的创作..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-1 overflow-auto">
                <AIGenerationPanel
                  novelId={novelId}
                  onContentGenerated={(generatedContent) => {
                    setContent(prev => prev + generatedContent);
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="world" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>世界背景</CardTitle>
                  <CardDescription>定义你的小说世界背景</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="world-name">世界名称</Label>
                      <Input
                        id="world-name"
                        placeholder="例如：天玄大陆"
                        value={novel.worldbuilding?.name || ""}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="world-description">世界描述</Label>
                      <Textarea
                        id="world-description"
                        placeholder="描述这个世界的基本情况..."
                        value={novel.worldbuilding?.description || ""}
                        readOnly
                      />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成详细世界观
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>修炼体系</CardTitle>
                  <CardDescription>设计你的小说修炼体系</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="system-name">体系名称</Label>
                      <Input id="system-name" placeholder="例如：灵气修炼体系" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="system-type">体系类型</Label>
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
                      <Label>体系复杂度</Label>
                      <Slider defaultValue={[5]} max={10} step={1} />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>简单</span>
                        <span>复杂</span>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成完整修炼体系
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="characters" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>创建角色</CardTitle>
                  <CardDescription>设计你的小说角色</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="character-name">角色名称</Label>
                      <Input id="character-name" placeholder="输入角色名称" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="character-role">角色定位</Label>
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
                      <Label>性格特点</Label>
                      <div className="grid grid-cols-2 gap-2">
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
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成角色卡片
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>角色列表</CardTitle>
                  <CardDescription>已创建的角色</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {novel.characters.length > 0 ? (
                      novel.characters.map((character) => (
                        <div key={character.id} className="flex items-center p-3 border rounded-lg">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-purple-600 font-bold">{character.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{character.name}</h4>
                            <p className="text-sm text-gray-500">{character.role}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            查看
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>暂无角色</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>技能系统</CardTitle>
                  <CardDescription>设计你的小说技能系统</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skill-name">技能名称</Label>
                      <Input id="skill-name" placeholder="例如：九天剑诀" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-type">技能类型</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择技能类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attack">攻击技能</SelectItem>
                          <SelectItem value="defense">防御技能</SelectItem>
                          <SelectItem value="support">辅助技能</SelectItem>
                          <SelectItem value="movement">移动技能</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-description">技能描述</Label>
                      <Textarea id="skill-description" placeholder="描述这个技能的效果..." />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成完整技能
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>物品系统</CardTitle>
                  <CardDescription>设计你的小说物品系统</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-name">物品名称</Label>
                      <Input id="item-name" placeholder="例如：青云剑" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-type">物品类型</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择物品类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weapon">武器</SelectItem>
                          <SelectItem value="armor">防具</SelectItem>
                          <SelectItem value="accessory">饰品</SelectItem>
                          <SelectItem value="consumable">消耗品</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-rarity">物品稀有度</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择稀有度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="common">普通</SelectItem>
                          <SelectItem value="uncommon">不凡</SelectItem>
                          <SelectItem value="rare">稀有</SelectItem>
                          <SelectItem value="epic">史诗</SelectItem>
                          <SelectItem value="legendary">传说</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成完整物品
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
