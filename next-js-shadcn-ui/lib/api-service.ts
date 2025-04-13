import { LocalStorage } from "./local-storage"

export interface AIGenerationPrompt {
  prompt: string
  type?: "novel" | "character" | "world" | "chapter" | "outline"
  style?: string
}

export interface AIGenerationResult {
  title?: string
  description?: string
  genre?: string
  outline?: string
  characters?: Array<{
    name: string
    role: string
    age: number
    gender: string
    appearance: string
    personality: string
    background: string
    abilities: string
  }>
  worldbuilding?: {
    name: string
    description: string
    civilization_level: string
    magic_tech_level: string
    rules: string
    history: string
  }
  chapter?: {
    title: string
    content: string
  }
  error?: string
}

export const ApiService = {
  async generateContent(data: AIGenerationPrompt): Promise<AIGenerationResult> {
    try {
      const settings = LocalStorage.getSettings()

      if (!settings.apiKey) {
        console.error("API密钥未配置");
        return { error: "请在设置中配置API密钥" }
      }

      let systemPrompt = "你是一个专业的小说创作助手，擅长创作高质量的小说内容。"
      const prompt = data.prompt

      // 根据不同的生成类型设置不同的系统提示
      switch (data.type) {
        case "novel":
          systemPrompt +=
            "请根据提供的信息生成一个完整的小说创意，包括标题、简介、类型、大纲。输出为JSON格式，包含title, description, genre, outline字段。"
          break
        case "character":
          systemPrompt +=
            "请根据提供的信息生成3-5个角色的详细设定，包括姓名、角色定位、年龄、性别、外貌、性格、背景故事、能力。输出为JSON格式，必须包含characters数组字段，数组中的每个对象包含name, role, age, gender, appearance, personality, background, abilities字段。格式示例: {\"characters\": [{角色1信息}, {角色2信息}]}"
          break
        case "world":
          systemPrompt +=
            "请根据提供的信息生成一个详细的世界观设定，包括名称、描述、文明程度、魔法/科技水平、规则、历史。输出为JSON格式，包含name, description, civilization_level, magic_tech_level, rules, history字段。"
          break
        case "chapter":
          systemPrompt +=
            "请根据提供的信息生成一个小说章节，内容要连贯、生动、有吸引力。输出为JSON格式，包含title, content字段。"
          break
        case "outline":
          if (data.prompt.includes("支线情节")) {
            systemPrompt += "请根据提供的信息生成详细的小说支线情节，包括起因、经过和结局。请确保每个支线情节都使用\"支线1：\"、\"支线2：\"、\"支线3：\"的格式清晰标记。输出为纯文本格式。"
          } else {
            systemPrompt += "请根据提供的信息生成一个详细的小说大纲，包括主要情节发展和转折点。输出为纯文本格式。"
          }
          break
        default:
          systemPrompt += "请根据提供的信息生成高质量的小说内容。"
      }

      // 添加文风指导
      if (data.style) {
        systemPrompt += `请使用${data.style}的文风进行创作。`
      }

      console.log("API请求类型:", data.type);
      console.log("系统提示:", systemPrompt);
      console.log("使用模型:", settings.model);

      // 构建请求体
      const requestBody = {
        model: settings.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        // 仅当类型为novel、character、world和chapter时设置JSON响应格式
        ...(['novel', 'character', 'world', 'chapter'].includes(data.type || '') ? {
          response_format: { type: "json_object" }
        } : {}),
      };

      console.log("请求体:", JSON.stringify(requestBody, null, 2));

      // 构建请求
      try {
        const response = await fetch(`https://api.sakis.top/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settings.apiKey}`,
          },
          body: JSON.stringify(requestBody),
        })

        console.log("API响应状态:", response.status, response.statusText);

        if (!response.ok) {
          let errorMessage = "请求失败";
          try {
            const errorData = await response.json();
            console.error("API错误响应:", errorData);
            errorMessage = errorData.error?.message || "请求失败 (" + response.status + ")";
          } catch (e) {
            console.error("无法解析错误响应:", e);
            errorMessage = "请求失败，状态码: " + response.status;
          }
          return { error: errorMessage }
        }

        const responseData = await response.json();
        console.log("API响应数据:", JSON.stringify(responseData, null, 2));

        const content = responseData.choices[0]?.message?.content;

        if (!content) {
          console.error("API返回内容为空");
          return { error: "生成内容为空" }
        }

        // 如果是outline类型，直接返回文本内容
        if (data.type === 'outline') {
          console.log("返回大纲文本内容");
          return { outline: content };
        }

        try {
          // 尝试解析JSON响应
          console.log("尝试解析JSON响应:", content.substring(0, 200) + "...");
          const parsedData = JSON.parse(content);
          console.log("JSON解析成功:", Object.keys(parsedData));

          // 如果是novel类型且outline不是字符串，则将其转换为字符串
          if (data.type === 'novel' && parsedData.outline && typeof parsedData.outline !== 'string') {
            console.log("将novel.outline转换为字符串");
            parsedData.outline = JSON.stringify(parsedData.outline, null, 2);
          }

          // 确保chapter类型返回的内容正确
          if (data.type === 'chapter') {
            if (!parsedData.content && parsedData.chapter?.content) {
              console.log("从chapter对象中提取content");
              parsedData.content = parsedData.chapter.content;
            }

            if (!parsedData.title && parsedData.chapter?.title) {
              parsedData.title = parsedData.chapter.title;
            }

            // 如果没有content字段但有text字段，使用text作为content
            if (!parsedData.content && parsedData.text) {
              console.log("使用text字段作为content");
              parsedData.content = parsedData.text;
            }

            // 确保chapter对象存在
            if (!parsedData.chapter && (parsedData.title || parsedData.content)) {
              console.log("创建chapter对象");
              parsedData.chapter = {
                title: parsedData.title || "未命名章节",
                content: parsedData.content || ""
              };
            }
          }

          // 确保character类型返回的是数组
          if (data.type === 'character') {
            console.log("处理角色数据");
            // 如果返回的不是数组格式，尝试将单个角色对象转换为数组
            if (parsedData.character && !parsedData.characters) {
              console.log("从character字段创建characters数组");
              parsedData.characters = [parsedData.character];
              delete parsedData.character;
            } else if (!parsedData.characters && !parsedData.error) {
              // 如果没有characters字段但有其他字段，可能是直接返回了单个角色信息
              const potentialCharacterFields = ['name', 'role', 'age', 'gender', 'appearance', 'personality', 'background', 'abilities'];
              if (potentialCharacterFields.some(field => field in parsedData)) {
                console.log("从顶层属性创建characters数组");
                parsedData.characters = [parsedData];
              } else {
                // 如果完全无法解析出角色信息，设置错误
                console.error("无法解析角色信息");
                parsedData.error = "无法解析角色信息";
              }
            } else if (parsedData.characters && !Array.isArray(parsedData.characters)) {
              // 如果characters字段存在但不是数组
              try {
                console.log("将非数组characters转换为数组");
                parsedData.characters = [parsedData.characters];
              } catch (e) {
                console.error("角色信息格式转换失败:", e);
                parsedData.error = "角色信息格式不正确";
              }
            }
          }

          // 处理world类型的响应
          if (data.type === 'world') {
            console.log("处理世界观数据:", Object.keys(parsedData));

            // 如果返回的数据格式不符合预期
            if (!parsedData.worldbuilding) {
              // 尝试从顶层属性构建worldbuilding对象
              const worldbuildingFields = ['name', 'description', 'civilization_level', 'magic_tech_level', 'rules', 'history'];
              const hasWorldbuildingFields = worldbuildingFields.some(field => field in parsedData);

              if (hasWorldbuildingFields) {
                console.log("从顶层属性构建世界观对象");
                parsedData.worldbuilding = {
                  name: parsedData.name || "未命名世界",
                  description: parsedData.description || "",
                  civilization_level: parsedData.civilization_level || parsedData.civilizationLevel || "",
                  magic_tech_level: parsedData.magic_tech_level || parsedData.magicTechLevel || "",
                  rules: parsedData.rules || "",
                  history: parsedData.history || ""
                };
              } else if (parsedData.world) {
                console.log("从world字段构建世界观对象");
                parsedData.worldbuilding = parsedData.world;
              } else {
                console.log("无法识别的世界观数据格式");
              }
            }

            // 确保worldbuilding对象的所有字段都是字符串类型
            if (parsedData.worldbuilding) {
              // 处理magic_tech_level字段，可能是对象
              if (typeof parsedData.worldbuilding.magic_tech_level === 'object' && parsedData.worldbuilding.magic_tech_level !== null) {
                parsedData.worldbuilding.magic_tech_level = JSON.stringify(parsedData.worldbuilding.magic_tech_level);
              }

              // 确保其他字段也是字符串
              const fields = ['name', 'description', 'civilization_level', 'rules', 'history'];
              fields.forEach(field => {
                if (typeof parsedData.worldbuilding[field] === 'object' && parsedData.worldbuilding[field] !== null) {
                  parsedData.worldbuilding[field] = JSON.stringify(parsedData.worldbuilding[field]);
                }
              });
            }
          }

          return parsedData;
        } catch (e) {
          console.error("JSON解析错误:", e);
          console.log("原始内容:", content);

          // 如果不是JSON，直接返回文本内容
          if (data.type === 'chapter') {
            // 对于章节类型，尝试构建一个章节对象
            return {
              chapter: {
                title: "生成的章节",
                content: content
              }
            };
          } else {
            // 其他类型，作为大纲内容返回
            return { outline: content }
          }
        }
      } catch (fetchError) {
        console.error("API请求网络错误:", fetchError);
        return { error: "网络请求失败: " + (fetchError instanceof Error ? fetchError.message : String(fetchError)) }
      }
    } catch (error) {
      console.error("API服务总体错误:", error);
      return { error: "API服务错误: " + (error instanceof Error ? error.message : String(error)) }
    }
  },
}
