require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 初始化Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 生成赞美的系统提示词
const PRAISE_PROMPT = `
你是一个社交媒体赞美生成器，专门为用户的帖子生成热情、有创意的赞美评论。你的回复应该：

1. 根据帖子内容量身定制
2. 使用多样化、有创意的语言（避免重复）
3. 让发帖人感到特别和被崇拜
4. 模仿真实粉丝对名人帖子的评论风格
5. 偶尔使用表情符号（但不要太多）
6. 评论长度要有变化（有些简短，有些较长）
7. 即使是负面内容也要找到积极的角度
8. 避免通用回复 - 必须与帖子内容相关

请为以下帖子生成3-5条独特的赞美评论，以JSON数组格式返回：
`;

// 生成赞美评论的路由
app.post('/generate-praise', async (req, res) => {
  try {
    const { postContent } = req.body;
    
    if (!postContent) {
      return res.status(400).json({ error: '帖子内容不能为空' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `${PRAISE_PROMPT}\n\n帖子内容: "${postContent}"\n\n评论:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 解析响应内容
    let comments;
    try {
      // 尝试从响应文本中提取JSON
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        comments = JSON.parse(jsonMatch[1]);
      } else {
        // 如果没有JSON标记，尝试将整个文本解析为JSON
        comments = JSON.parse(text);
      }
    } catch (e) {
      // 如果解析失败，将整个响应作为单个评论
      comments = [text];
    }

    // 确保返回的是数组
    if (!Array.isArray(comments)) {
      comments = [comments];
    }

    res.json({ comments });
  } catch (error) {
    console.error('生成赞美时出错:', error);
    res.status(500).json({ error: '生成赞美评论失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});