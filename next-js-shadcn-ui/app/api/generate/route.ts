import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt, type, style } = await req.json()

    console.log("API路由收到请求:", { type, style, promptLength: prompt?.length });

    let systemPrompt = "你是一个专业的小说创作助手，擅长创作高质量的小说内容。"

    // 根据不同的生成类型设置不同的系统提示
    switch (type) {
      case "chapter":
        systemPrompt += "请根据提供的信息生成一个小说章节，内容要连贯、生动、有吸引力。输出内容应该是纯文本格式，不需要JSON格式。"
        break
      case "character":
        systemPrompt += "请根据提供的信息生成一个详细的角色设定，包括外貌、性格、背景故事等。输出内容应该是纯文本格式，不需要JSON格式。"
        break
      case "world":
        systemPrompt += "请根据提供的信息生成一个详细的世界观设定，包括历史、地理、文化等。输出内容应该是纯文本格式，不需要JSON格式。"
        break
      case "plot":
        systemPrompt += "请根据提供的信息生成一个完整的情节大纲，包括起因、经过、结果。输出内容应该是纯文本格式，不需要JSON格式。"
        break
      default:
        systemPrompt += "请根据提供的信息生成高质量的小说内容。输出内容应该是纯文本格式，不需要JSON格式。"
    }

    // 添加文风指导
    if (style) {
      systemPrompt += `请使用${style}的文风进行创作。`
    }

    console.log("系统提示:", systemPrompt);

    try {
      const result = streamText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt,
      })

      console.log("流式响应已创建");
      return result.toDataStreamResponse()
    } catch (streamError) {
      console.error("创建流式响应错误:", streamError);
      return new Response(JSON.stringify({ error: "生成内容时发生错误" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("处理API请求错误:", error);
    return new Response(JSON.stringify({ error: "处理请求时发生错误" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
