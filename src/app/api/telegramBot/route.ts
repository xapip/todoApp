import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

/* bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    bot.sendMessage(chatId, "Добро пожаловать в Todo App! 🚀");
  }
    
    if (text.startsWith("/notify")) {
    const [, ...message] = text.split(" ");
    await bot.sendMessage(chatId, `Уведомление: ${message.join(" ")}`);
  }
});

export default function handler(req, res) {
  res.status(200).json({ message: "Telegram bot is running" });
} */
