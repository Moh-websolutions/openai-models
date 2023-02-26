import { Configuration, OpenAIApi } from "openai";
import Meals from "..";

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
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2048,
    n: 1,
  });

  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(gender, age, weight, fatLose, foods) {
  return `Suggest meal plans for Monday, Tuesday, Wednesday, Thursday, and Friday that may include breakfast, lunch, a snack, and dinner with ${foods} when possible.

  Sunday:

  meal #1 Breakfast: Overnight oats with 1/2 cup oats, 1/2 cup Greek yogurt, 1/4 cup diced strawberries, 1/4 cup diced blueberries, and 1 tablespoon honey.
  meal #2 Lunch: Turkey and avocado wrap with 1/4 cup diced turkey, 1/4 avocado, 1/4 cup diced tomatoes, and 1/4 cup diced cucumbers in a whole wheat wrap.
  meal #3 Snack: Apple slices with 1 tablespoon of almond butter.
  meal #4 Dinner: Baked salmon with 1/2 cup cooked quinoa and roasted Brussels sprouts.
  `;
}