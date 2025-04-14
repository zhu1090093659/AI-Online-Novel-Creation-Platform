// 小说类型定义
export interface Novel {
  id: string
  title: string
  description: string
  genre: string
  cover_url: string
  created_at: string
  updated_at: string
  chapters: Chapter[]
  characters: Character[]
  worldbuilding: WorldBuilding | null
  outline: string
}

export interface Chapter {
  id: string
  novel_id: string
  title: string
  content: string
  summary?: string
  order_index: number
  created_at: string
  updated_at: string
  previous_chapter_id?: string | null
}

export interface Character {
  id: string
  novel_id: string
  name: string
  role: string
  age: number
  gender: string
  appearance: string
  personality: string
  background: string
  abilities: string
  created_at: string
  updated_at: string
}

export interface WorldBuilding {
  id: string
  novel_id: string
  name: string
  description: string
  civilization_level: string
  magic_tech_level: string
  rules: string
  history: string
  created_at: string
}

export interface WritingStyle {
  id: string
  name: string
  type: string
  parameters: Record<string, any>
  created_at: string
}

export interface UserSettings {
  apiKey: string
  model: string
  theme: string
  customWritingStyle: string // 自定义文风
}

// 默认设置
const DEFAULT_SETTINGS: UserSettings = {
  apiKey: "",
  model: "gemini-2.5-pro-preview-03-25",
  theme: "light",
  customWritingStyle: "", // 默认为空
}

// 本地存储服务
export const LocalStorage = {
  // 小说相关
  getNovels(): Novel[] {
    const novels = localStorage.getItem("novels")
    return novels ? JSON.parse(novels) : []
  },

  saveNovel(novel: Novel): void {
    const novels = this.getNovels()
    const index = novels.findIndex((n) => n.id === novel.id)

    if (index >= 0) {
      novels[index] = novel
    } else {
      novels.push(novel)
    }

    localStorage.setItem("novels", JSON.stringify(novels))
  },

  getNovelById(id: string): Novel | null {
    const novels = this.getNovels()
    return novels.find((novel) => novel.id === id) || null
  },

  deleteNovel(id: string): void {
    const novels = this.getNovels()
    const filteredNovels = novels.filter((novel) => novel.id !== id)
    localStorage.setItem("novels", JSON.stringify(filteredNovels))
  },

  // 文风相关
  getWritingStyles(): WritingStyle[] {
    const styles = localStorage.getItem("writing_styles")
    return styles ? JSON.parse(styles) : []
  },

  saveWritingStyle(style: WritingStyle): void {
    const styles = this.getWritingStyles()
    const index = styles.findIndex((s) => s.id === style.id)

    if (index >= 0) {
      styles[index] = style
    } else {
      styles.push(style)
    }

    localStorage.setItem("writing_styles", JSON.stringify(styles))
  },

  deleteWritingStyle(id: string): void {
    const styles = this.getWritingStyles()
    const filteredStyles = styles.filter((style) => style.id !== id)
    localStorage.setItem("writing_styles", JSON.stringify(filteredStyles))
  },

  // 用户设置相关
  getSettings(): UserSettings {
    const settings = localStorage.getItem("user_settings")
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem("user_settings", JSON.stringify(settings))
  },

  // 生成唯一ID
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  },
}
