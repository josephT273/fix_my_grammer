import OpenSchoolAdwa from "open-schooladwa";
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!BOT_TOKEN || !GEMINI_API_KEY) {
  throw new Error("Error: unable to find the keys");
}

const OSA = new OpenSchoolAdwa().initGoogle({
  GEMINI_API_KEY: GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});
export const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    `👋 Welcome to Fix My Grammar Bot!\n\n
        This bot is powered by Gemini Flash 2.0, ready to help you polish your writing.
        Just send any non-grammatically correct message, and it’ll reply with a perfectly fixed version.\n\n
        📝 Enjoy improving your grammar — one sentence at a time!\n\n
        
        💬 Example User Messages & Bot Replies\n\n
        User: i doesnt know how to use this bot\n
        Bot: I don’t know how to use this bot.
        `,
  );
});

bot.on("text", async (ctx) => {
  try {
    const message = ctx.message.text;
    const replay_massage = (await OSA.chat(message)) as string;
    await ctx.reply(replay_massage);
  } catch (error) {
    await ctx.reply("❌ Failed to send message. Please try again.");
    console.log(error);
  }
});

bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("❌ An error occurred. Please try again.");
});

export default bot;
