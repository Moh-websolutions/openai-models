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
  return `Suggest 4 meals plan for a ${age}-year-old ${gender} with a weight of ${weight} lbs who is into ${foods}, to lose ${fatLose} lbs per week.
 
  Breakfast: Omelette with 2 eggs, 1/4 cup diced chicken, 1/4 cup diced vegetables, and 1/4 cup cooked brown rice
  
  Lunch: Grilled chicken salad with 3 ounces of grilled chicken, 1/2 cup cooked brown rice, 1/2 cup of vegetables, and a light vinaigrette.
  
  Dinner: Beef stir-fry with 3 ounces of beef, 1/2 cup cooked brown rice, 1/2 cup of vegetables, and a light sauce.
  
  Snack: Yogurt with 1/2 cup of fresh fruit.
 
  `;
}