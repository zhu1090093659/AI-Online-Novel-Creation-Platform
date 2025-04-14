import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  console.log("API路由收到请求");
  try {
    // 验证请求方法
    if (req.method !== 'POST') {
      console.error("非法请求方法:", req.method);
      return new Response(JSON.stringify({ error: "只支持POST请求" }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 解析请求体
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("解析请求体错误:", parseError);
      return new Response(JSON.stringify({ error: "无效的JSON格式" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { prompt, type, style } = requestData;

    // 验证必要参数
    if (!prompt) {
      console.error("缺少prompt参数");
      return new Response(JSON.stringify({ error: "缺少必要的prompt参数" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
      // 从请求中获取模型名称
      // 注意：我们不能在服务器端使用 localStorage
      // 所以我们需要从请求中获取模型名称，或者使用默认值
      const modelName = requestData.model || "gpt-3.5-turbo"; // 默认使用 gpt-3.5-turbo

      console.log("开始创建流式响应...");
      console.log("使用模型:", modelName);
      console.log("提示长度:", prompt.length);

      const result = streamText({
        model: openai(modelName),
        system: systemPrompt,
        prompt,
        temperature: 1.0,
        maxTokens: 1048576,
      })

      console.log("流式响应已创建成功");

      // 返回流式响应
      const response = result.toDataStreamResponse();
      console.log("流式响应已返回");
      return response;
    } catch (streamError) {
      console.error("创建流式响应错误:", streamError);
      console.error("错误详情:", streamError instanceof Error ? streamError.message : String(streamError));
      console.error("错误堆栈:", streamError instanceof Error ? streamError.stack : '无堆栈信息');

      // 返回更详细的错误信息
      return new Response(JSON.stringify({
        error: "生成内容时发生错误",
        details: streamError instanceof Error ? streamError.message : String(streamError)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("处理API请求错误:", error);
    console.error("错误详情:", error instanceof Error ? error.message : String(error));
    console.error("错误堆栈:", error instanceof Error ? error.stack : '无堆栈信息');

    return new Response(JSON.stringify({
      error: "处理请求时发生错误",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
