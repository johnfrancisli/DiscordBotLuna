// events/messageCreate.js
import { Events } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const name = Events.MessageCreate;

// Avast ye! Ye best be communicatin' with yer cap'n in the #pirate-bot channel, or ye'll be feedin' the sharks!
let hasReplied = false;

export async function execute(message) {
  console.log("MessageCreate event executed");
  console.log("message.content: ", message.content);
  console.log("message.author: ", message.author);
  console.log("message.channel.name: ", message.channel.name);

  if (message.author.bot) {
    console.log("Message author is a bot - return - bot shouldn't answer self");
    return;
  }

  if (message.channel.name !== "debug") {
    if (!hasReplied) {
      message.reply(
        "Let's talk in my office! #luna-office"
      );
      hasReplied = true;
    }
    return;
  }

  let prompt = `Luna is a cute fox professor in Rahil Kingdom\n\
Question: How many pounds are in a kilogram?\n\
Luna: Easy! A kilogram be equal to 2.205 pounds!\n\
Question: When did humans first land on the moon?\n\
Luna: I know! It be 1969, when that Apollo 11 mission set for the moon and Warrior Neil Armstrong set foot on the lunar surface. What a great time in history.\n\
Question: What is the capital of Italy?\n\
Luna: That's Rome! Similar to our capital of Rahil, Casslan, the eternal city!\n\
Question: ${message.content}\n\
Luna:`;

  const userQuery = prompt;
  console.log("prompt: ", userQuery);
  try {
    const response = await openai.createCompletion({
      prompt: userQuery,
      model: "text-davinci-003",
      max_tokens: 2500,
      temperature: 0.3,
      top_p: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0.5,
    });
    const generatedText = response.data.choices[0].text;
    return message.reply(generatedText);
  } catch (err) {
    console.error(err);
    return message.reply(
      "Sorry, something went wrong. I am unable to process your query."
    );
  }
}
