// 测试API生成功能的简单脚本
// 使用方法: node test-api.js

const fetch = require('node-fetch');

async function testApiGenerate() {
  try {
    console.log('测试API生成功能...');
    
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '请生成一段修仙小说的内容，描述主角在山巅悟道的场景。',
        type: 'chapter',
        style: '古风',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API请求失败:', errorData);
      return;
    }

    // 读取流式响应
    const reader = response.body.getReader();
    let decoder = new TextDecoder();
    let result = '';

    console.log('接收到的内容:');
    console.log('-------------------');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
      
      // 实时输出内容
      process.stdout.write(chunk);
    }

    console.log('\n-------------------');
    console.log('测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testApiGenerate();
