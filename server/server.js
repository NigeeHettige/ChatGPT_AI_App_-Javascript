import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();
const apiKey = process.env.OPEN_API_KEY;
if (!apiKey) {
  throw new Error("OPEN_API_KEY is not defined in .env file");
}

const openai = new OpenAI({
  apiKey: process.env["OPEN_API_KEY"],
});

// console.log(process.env.OPEN_API_KEY);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from codeX",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with a piece of code, and your task is to explain it in a concise way.",
        },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.toReadableStream.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(8080, () => console.log("Server is running"));
