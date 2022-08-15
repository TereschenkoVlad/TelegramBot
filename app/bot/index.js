const config = require("../config");
const {Telegraf} = require("telegraf");
const {MenuTemplate, MenuMiddleware, createBackMainMenuButtons} = require('telegraf-inline-menu');

const menuTemplate = new MenuTemplate(`📝 Головне меню! Обирай, що цікавить:`);
const aboutSubmenu = new MenuTemplate('🗒 Про заклад:');
const applicantSubmenu = new MenuTemplate('🗒 Абітурієнту:');

// ABOUT UNIVERSITY MENU
aboutSubmenu.interact('📞 Управління - контактна інформація 📱', 'contact', {
  do: async ctx => {
    await ctx.reply('В.о. директора Шабанова Олена Вікторівна: 📞 (097) 513-40-80');
    await menuMiddleware.replyToContext(ctx, '/aboutUniversity/contact/');
    return false;
  }
});

aboutSubmenu.interact('🏝 Геолокація 🏝', 'location', {
  do: async ctx => {
    await ctx.replyWithLocation('49.4077974', '32.0541398');
    await menuMiddleware.replyToContext(ctx, '/aboutUniversity/location/');
    return false;
  }
});

aboutSubmenu.url('🌐 Website 🌐', 'https://cherkasy-unit.lnu.edu.ua');
aboutSubmenu.url('↪ Facebook ↩', 'https://www.facebook.com/ubscibs/');

// APPLICANT SUBMENU
applicantSubmenu.interact('📜 Правила вступу 2022 📜', 'rules', {
  do: async ctx => {
    await ctx.reply('➡ https://cherkasy-unit.lnu.edu.ua/pravyla-2022/');
    await menuMiddleware.replyToContext(ctx, '/applicant/rules/');
    return false;
  }
});

applicantSubmenu.interact('📆 Графік роботи приймальної комісії 📆', 'schedule', {
  do: async ctx => {
    await ctx.reply('📞 Приймальна комісія: (067)783-51-91');
    await menuMiddleware.replyToContext(ctx, '/applicant/schedule/');
    return false;
  }
});

applicantSubmenu.interact('💰 Вартість навчання 💰', 'price', {
  do: async ctx => {
    await ctx.replyWithDocument('https://cherkasy-unit.lnu.edu.ua/wp-content/uploads/2022/08/cost3.pdf');
    await menuMiddleware.replyToContext(ctx, '/applicant/price/');
    return false;
  }
});

applicantSubmenu.interact('🏫 Гуртожитки 🏫', 'hostels', {
  do: async ctx => {
    await ctx.reply('https://cherkasy-unit.lnu.edu.ua/publichna-informatsiia/');
    await menuMiddleware.replyToContext(ctx, '/applicant/hostels/');
    return false;
  }
});

aboutSubmenu.manualRow(createBackMainMenuButtons('🔝 Про заклад', '🔝 Головне меню'));
applicantSubmenu.manualRow(createBackMainMenuButtons('🔝 Абітурієнту', '🔝 Головне меню'));

menuTemplate.submenu('🏢 🔥 Про Черкаське відділення ЛНУ ім. І. Франка', 'aboutUniversity', aboutSubmenu, {
  joinLastRow: false,
});
menuTemplate.submenu('💁‍♂️ Абітурієнту', 'applicant', applicantSubmenu, {
  joinLastRow: false,
});

const bot = new Telegraf(config.app.botToken);

const menuMiddleware = new MenuMiddleware('/', menuTemplate);

bot.start(async (ctx) => {
  await ctx.reply(`Привіт ${ctx.from.first_name}!`)
  await ctx.reply('Тебе вітає "Черкаське навчально-наукове відділення Львівського національного університету іменіІвана Франка"! 🔥');
  await ctx.replyWithPhoto('https://cherkasy-unit.lnu.edu.ua/wp-content/uploads/2022/08/CIBS_220805.jpg');
  await menuMiddleware.replyToContext(ctx);
});

bot.command('/menu', async (ctx) => {
  await menuMiddleware.replyToContext(ctx, '/');
})
bot.use(menuMiddleware);

module.exports = bot;
