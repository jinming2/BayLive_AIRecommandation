// require('dotenv').config();

// const express = require('express');
// const app = express();
// const axios = require('axios');
// const OpenAI = require('openai');

// app.use(express.json());

// const PORT = process.env.PORT || 8081;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });


// app.post('/ask', async (req, res) => {
//     const userMessage = req.body.userMessage;

//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // Ensure you're using the correct model you have access to
//             messages: [
//                 { role: "system", content: "You are a helpful assistant." },
//                 { role: "user", content: userMessage }
//             ],
//         });

//         const responseMessage = completion.choices[0].message.content;
//         res.json({ answer: responseMessage });
//     } catch (error) {
//         console.error('Error calling OpenAI API:', error);
//         res.status(500).json({ message: 'Error processing your request' });
//     }
// });
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });


// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// index.js
const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const OpenAIChatService = require('./chatService');
const OpenAIChatServiceProxy = require('./proxy');
const cors = require('cors');  // npm install cors
app.use(cors());  // This will allow all CORS requests


app.use(express.json());

const realChatService = new OpenAIChatService(process.env.OPENAI_API_KEY);
const chatServiceProxy = new OpenAIChatServiceProxy(realChatService);

app.post('/api/aichat', async (req, res) => {
  try {
    const question = req.body.userMessage;
    const answer = await chatServiceProxy.ask(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
