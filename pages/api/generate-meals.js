import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { gender, age, weight, fatLose, foods } = req.body;
  const prompt = generatePrompt(gender, age, weight, fatLose, foods);

  console.log(prompt);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.6,
    max_tokens: 2048,
  });

  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(gender, age, weight, fatLose, foods) {
  return `suggest 7 meal plan ideas for the week to help lose ${fatLose} LBS per week for a ${age} years old ${gender} with weight of ${weight} LBS that is into ${foods}`;
}