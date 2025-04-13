import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const systemPrompt = `你是一个专业的小说创作助手，擅长帮助作者解决创作过程中的问题。
你可以提供以下帮助：
1. 角色设计建议
2. 情节构思
3. 世界观构建
4. 文风调整
5. 创作技巧指导
请根据用户的问题提供专业、有帮助的建议。`

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
