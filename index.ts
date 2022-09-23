import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
const token: string = String(process.env.TOKEN);
require("./model");
const db: any = require("./model/index");
const User: any = db.user;
const Channel: any = db.channel;
const News: any = db.news;

//interfaces for typescript
interface User {
  username: string;
  telegram_id: bigint;
}
interface Channel {
  name: string;
  telegram_id: bigint;
  news_id?: bigint;
  userId: number;
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
  let string = `<span class="tg-spoiler"><i>Assalomu alaykum.Bizning botimizdan foydalanish qo'llanmasi.</i>\n<u>Botni ishga tushurgandan so'ng uni kanalingizga qo'shib qo'yishingiz mumkin.\nKanalingizga yangiliklarni avtomatik qo'shib boradi.Biz yangi funksiyalar ustida ishlayapmiz.\nSiz qachon yangilik tashlanishini rejalashtirishingiz mumkun bo'ladi.</u></span>\n`;
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(id, string, {
    parse_mode: "HTML",
  });
});
bot.on("channel_post", async (ctx: any) => {
  console.log(ctx.update);
  const text: string = ctx.update.channel_post.text;
  const id: bigint = ctx.update.channel_post.chat.id;
  const messageId: bigint = ctx.update.channel_post.message_id;
  if (text == "news") {
    const channel = await Channel.findOne({
      where: {
        telegram_id: id,
      },
    });
    if (!channel.news_id) {
      const newsChannel = await News.findAll({
        order: [["date", "DESC"]],
      });
      Channel.update(
        { news_id: newsChannel[0].id },
        { where: { telegram_id: id } }
      );

      for (let i = 0; i < 10; i++) {
        // const element = array[i];
        //bu yerda funksiya bo'ladi va u kerakli yangilikni jo'natadi
      }
    } else {
      const channelnew = await Channel.findOne({
        where: { telegram_id: id },
      });
      const newsUpdate = await News.findOne({
        where: { id: channelnew.news_id },
      });
      const newsChan = await News.findAll({
        where: {
          date: {
            [db.Op.gt]: newsUpdate.date,
          },
        },
        order: [["date", "DESC"]],
      });
      const upt = await Channel.update(
        {
          news_id: newsChan[0].dataValues.id,
        },
        {
          where: {
            telegram_id: id,
          },
        }
      );
      if (upt) {
        for (let i = 0; i < newsChan.length; i++) {
          // const element = array[i];
          //bu yerda funksiya bo'ladi va u kerakli yangilikni jo'natadi
        }
      }
    }
  }
});
bot.hears("music", async (ctx: any) => {
  ctx.reply(
    "Bu yerda musiqa yo'q necha marta aytay musiqa yo'q deb yangiliklar bor"
  );
});
bot.on("my_chat_member", async (ctx: any) => {
  const id: bigint = ctx.update.my_chat_member.chat.id;
  const name: string = ctx.update.my_chat_member.chat.username;
  const userid: bigint = ctx.update.my_chat_member.from.id;
  console.log(userid);
  const test = ctx.update.my_chat_member.new_chat_member.status;
  let objUser;
  objUser = await User.findOne({
    where: {
      telegram_id: userid,
    },
  });

  if (!objUser) {
    const user: object = { username: name, telegram_id: userid } as User;
    objUser = await User.create(user);
  }
  const findChannel = await Channel.findOne({
    where: {
      telegram_id: id,
    },
  });
  if (!findChannel) {
    const channel: object = {
      telegram_id: id,
      name: name,
      userId: Number(objUser.id),
    } as Channel;
    const obj = await Channel.create(channel);
  }
  if (test === "kicked" && objUser) {
    ctx.telegram.sendMessage(
      userid,
      `@${name} kanalingizdan chopildim tashlandim`
    );
  }
  if (test == "administrator" && objUser) {
    ctx.telegram.sendMessage(userid, `@${name} kanalingizga qo'shildim `);
  }
});
bot.launch();
