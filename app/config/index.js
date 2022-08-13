module.exports = {
  app: {
    port: process.env.APP_PORT || '3000',
    botToken: process.env.TELEGRAM_BOT_TOKEN
  },
  error: {
    sendFullErrors: true,
  }
};
