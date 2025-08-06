const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const personalAnswers = {
  "what should we know about your life story in a few sentences": 
    "I’m Divyansh, a full-stack developer with a deep hunger for growth and learning. I was raised by a single parent, and from a young age, I had to take on responsibilities that shaped who I am. That upbringing taught me the importance of survival, kindness, and adaptability—qualities that continue to guide me in both life and work.",

  "what's your #1 superpower": 
    "My one superpower is my ability to adapt quickly and stay calm under pressure. Whether it's learning a new technology or handling unexpected challenges, I embrace change with a mindset focused on growth.",

  "what are the top 3 areas you'd like to grow in": 
    "1. Deepening my knowledge of scalable backend architectures, 2. Becoming more confident and articulate in public and professional communication, 3. Exploring AI integrations and creative experimentation with new tools.",

  "what misconception do your coworkers have about you": 
    "Sometimes people think I’m too quiet or reserved, but the truth is—I’m always observing, learning, and absorbing. Once I’m comfortable, I contribute deeply and consistently to the team’s progress.",

  "how do you push your boundaries and limits": 
    "By constantly throwing myself into things I don’t fully know yet. I believe in learning by doing. Whether it’s picking up a new framework or taking on a project I’ve never done before, I challenge myself through action."
};

function matchQuestion(text) {
  const lower = text.toLowerCase();
  for (let question in personalAnswers) {
    if (lower.includes(question)) {
      return personalAnswers[question];
    }
  }
  return null;
}

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  const answer = matchQuestion(message);
  if (answer) {
    return res.json({ reply: answer });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Respond as Divyansh Vijay — a smart, warm, confident software engineer who answers questions about his personality and career with honesty and clarity.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = chatResponse.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
