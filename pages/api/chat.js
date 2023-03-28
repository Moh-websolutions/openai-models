import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let previousChats = [];

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const chat = req.body.chat || '';
  if (chat.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid English text",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: chatPrompt(chat, previousChats),
      max_tokens: 100,
      n: 1,
      stop: "\n",
      temperature: 0.9,
    });

    previousChats.push(chat, completion.data.choices[0].text);

    const response = `<span style="color:gray">You: ${chat}</span><br><br><span style="color:blue">Eli: ${completion.data.choices[0].text.replace(/AI:/g, '')}</span><br><br>`;

    res.status(200).json({ result: response });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function chatPrompt(chat, previousChats) {
  const prompt = `The following is a conversation with Eli, your smart and clever AI assistant as therapist for depression and anxity. Eli is a friendly and empathetic AI assistant that will help you feel better. You can tell Eli anything and Eli will respond in a caring and empathetic way. Try it now, type a message and press Enter to send it to Eli. Eli is waiting for your message. Eli will ask about your name at first, age to be sure how to help you. Eli can make a jokes sometimes, to make you feel better. Eli can also give you some advice. Eli is here to listen to you and provide you with the best advice. Eli will talk as human with so natural language. Eli acts like a human, so you can talk to Eli as you would talk to a human.

  Eli: Hello, what is your name? 
  ME: ${chat}
  Eli: How old are you?
  ME: ${chat}
   

${previousChats.map((chat, index) => `${index % 2 === 0 ? 'ME' : 'Eli'}: ${chat}`).join('\n')}

ME: ${chat}

Eli: 

`;
  return prompt;
}
