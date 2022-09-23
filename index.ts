import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
const token: string = String(process.env.TOKEN);
require("./model");
const db: any = require("./model/index");
const User: any = db.user;
interface User {
  username: string;
  telegram_id: bigint;
}
const bot = new Telegraf(token);
bot.start(async (ctx: any) => {
  console.log(ctx);
  const id = ctx.update.message.from.id;
  const name = ctx.update.message.from.username;
  const nameA = ctx.update.message.from.first_name;
  const shart = await User.findOne({
    where: {
      telegram_id: id,
    },
  });
  if (shart) {
  } else {
    const user: object = { username: name || nameA, telegram_id: id } as User;
    const obj = await User.create(user);
  }
  ctx.telegram.sendMessage(
    id,
    `Salom bizning botimizga xush kelibsiz <a href = 't.me/${name}'> ${nameA}</a>`,
    { parse_mode: "HTML" }
  );
});
bot.command("help", async (ctx: any) => {
  let string = `<i>Assalomu alaykum.Bizning botimizdan foydalanish qo'llanmasi.</i>\n<u>Botni ishga tushurgandan so'ng uni kanalingizga qo'shib qo'yishingiz mumkin.\nKanalingizga yangiliklarni avtomatik qo'shib boradi.Biz yangi funksiyalar ustida ishlayapmiz.\nSiz qachon yangilik tashlanishini rejalashtirishingiz mumkun bo'ladi.</u>\n`;
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(id, string, {
    parse_mode: "HTML",
  });
});
bot.hears("salom", async (ctx: any) => {
  ctx.reply("salom bacha keldingmi");
});
bot.launch();
