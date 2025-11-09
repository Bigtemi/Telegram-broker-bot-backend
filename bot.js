const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Register with broker and send screenshot to get access.");
});

bot.on('photo', async (msg) => {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const file = await bot.getFileLink(fileId);
    const screenshotBase64 = (await axios.get(file, {responseType: 'arraybuffer'})).data.toString('base64');

    const res = await axios.post(`${process.env.BACKEND_URL}/verify`, {
        userId: msg.from.id,
        screenshotBase64
    });

    if(res.data.status === "verified") {
        bot.sendMessage(msg.chat.id, "✅ Verified! Here’s your channel link: " + process.env.CHANNEL_ID);
    } else {
        bot.sendMessage(msg.chat.id, "❌ Verification failed. Please check your screenshot.");
    }
});
