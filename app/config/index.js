require("dotenv").config();

module.exports = {
  app: {
    port: process.env.APP_PORT || 5000,
    botToken: process.env.TELEGRAM_BOT_TOKEN
  },
  error: {
    sendFullErrors: true,
  }
};
