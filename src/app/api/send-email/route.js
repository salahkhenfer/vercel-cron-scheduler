import axios from "axios";

async function sendToTelegram(text) {
  const botToken = "6628430616:AAGuHrDIfDwKy1jfb1YRTlenF2WNFNG_rF0";
  const chatId = "@salah1212121221"; // Replace with your desired chat ID
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await axios.post(apiUrl, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    });

    console.log("Message sent to Telegram:", response.data);
  } catch (error) {
    console.error("Error sending message to Telegram:", error.message);
  }
}
const messageText = "Hello, this is a test imad  this is from file js.";
sendToTelegram(messageText);
