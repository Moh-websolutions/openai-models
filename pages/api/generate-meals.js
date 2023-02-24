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
    temperature: 0.6,
    max_tokens: 2048,
  });

  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(gender, age, weight, fatLose, foods) {
  return `Write three meal plans for the week that may include ${foods}
 
  1. Breakfast: Omelet with 2 eggs, 1/4 cup diced onion, 1/4 cup diced bell pepper, 1/4 cup diced mushrooms, 1/4 cup diced chicken, and 2 tablespoons shredded cheese.
  2. Lunch: Chicken and vegetable stir-fry with 1 cup cooked brown rice.
  3. Snack: Greek yogurt with 1/4 cup diced strawberries and 1/4 cup granola.
  4. Dinner: Baked chicken breast with 1/2 cup cooked quinoa and roasted vegetables.
  `;
}