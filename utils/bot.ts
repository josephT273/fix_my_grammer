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
    `👋 *Welcome to Fix My Grammar Bot!*\n\n` +
    `This bot is powered by *Gemini Flash 2.0*, ready to help you polish your writing.\n\n` +
    `✨ *Features:*\n` +
    `• Fix grammar and spelling errors\n` +
    `• Get 3 different style options (Formal, Casual, Creative)\n` +
    `• Copy corrected text by clicking on it\n` +
    `• Get explanations of grammar issues\n\n` +
    `📝 *How to use:*\n` +
    `Just send any text and I'll provide multiple corrected versions!\n\n` +
    `💬 *Example:*\n` +
    `*You:* i doesnt know how to use this bot\n` +
    `*Me:* 3 different corrected versions + explanation\n\n` +
    `Type /help for more commands!`,
    { parse_mode: 'Markdown' }
  );
});

bot.help(async (ctx) => {
  await ctx.reply(
    `🤖 *Fix My Grammar Bot - Help*\n\n` +
    `*Commands:*\n` +
    `/start - Welcome message\n` +
    `/help - Show this help message\n` +
    `/about - About this bot\n\n` +
    `*How it works:*\n` +
    `1. Send any text with grammar issues\n` +
    `2. Get 3 corrected versions:\n` +
    `   • **Formal** - For business/academic use\n` +
    `   • **Casual** - For everyday conversation\n` +
    `   • **Creative** - For creative writing\n` +
    `3. Click on any text to copy it\n` +
    `4. Learn from the grammar explanations\n\n` +
    `*Tips:*\n` +
    `• Use backticks (\`) for code-like text\n` +
    `• All corrected text is clickable to copy\n` +
    `• Works with any language, but optimized for English`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('about', async (ctx) => {
  await ctx.reply(
    `ℹ️ *About Fix My Grammar Bot*\n\n` +
    `*Version:* 2.0\n` +
    `*AI Model:* Gemini Flash 2.0\n` +
    `*Features:* Multi-style grammar correction\n\n` +
    `*Developer:* Built with Next.js & Telegraf\n` +
    `*Source:* Open source project\n\n` +
    `*Support:* Contact @your_username for help`,
    { parse_mode: 'Markdown' }
  );
});

bot.on("text", async (ctx) => {
  try {
    const message = ctx.message.text;
    
    // Create a comprehensive prompt for better grammar correction
    const prompt = `Please fix the grammar and improve the following text. Provide 3 different versions with different styles:

1. **Formal/Professional**: For business, academic, or official communication
2. **Casual/Friendly**: For everyday conversation and informal writing  
3. **Creative/Engaging**: For creative writing, social media, or storytelling

Original text: "${message}"

Please format your response as:
**Formal:** [corrected text]
**Casual:** [corrected text]  
**Creative:** [corrected text]

Also provide a brief explanation of the main grammar issues found.`;

    const reply_message = (await OSA.chat(prompt)) as string;
    
    // Format the response with markdown and copyable text
    const formatted_response = `*Original Text:*\n\`${message}\`\n\n*Grammar Corrections:*\n\n${reply_message}\n\n💡 *Tip:* Click on any corrected text to copy it!`;
    
    await ctx.reply(formatted_response, { parse_mode: 'Markdown' });
  } catch (error) {
    await ctx.reply("❌ *Failed to send message. Please try again.*", { parse_mode: 'Markdown' });
    console.log(error);
  }
});

bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("❌ *An error occurred. Please try again.*", { parse_mode: 'Markdown' });
});

export default bot;