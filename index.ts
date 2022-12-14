import { Telegraf } from "telegraf";

import dotenv from "dotenv";
import { update } from "./utility/bazaUpdate";
import axios from "axios";
import Cheerio from "cheerio";
const crone = require("node-cron");
dotenv.config({ path: "./config.env" });

import { SendMessage } from "./utility/sendNews";
const token: string = String(process.env.TOKEN);

//
const getUrl = async (url: string) => {
  let data: { data: string; headers: any } = await axios.get(url, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  console.log(data.headers);
  return data.data;
};
//
// functons await for update
const getTitleStr: (url: string) => void = async (url) => {
  const data = await getUrl(url);
  const $ = Cheerio.load(data);
  let titleStr = $(".news-item.detail.content_text")
    .children("p")
    .first()
    .text()
    .trim();
  if (!titleStr) {
    titleStr = $(".news-item.detail.content_text")
      .find("p")
      .first()
      .text()
      .trim();
  }
  return titleStr;
};
//functions await for update with
import cli from "cli-color";
require("./model");
// typescript database
const db: any = require("./model/index");
const User: any = db.user;
const Channel: any = db.channel;
const News: any = db.news;
//typescript database
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
    `Hello, welcome to our bot <a href = 't.me/${name}'> ${nameA}</a>.Bot user manual /help`,
    { parse_mode: "HTML" }
  );
});
bot.command("help", async (ctx: any) => {
  let string = `<span class="tg-spoiler"><i>Hello. How to use our bot.</i>\n<u>After launching the bot, you can add it to your channel.\nAutomatically adds news to your channel. We are working on new features.\nYou can schedule when updates are released.</u></span>\n`;
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(id, string, {
    parse_mode: "HTML",
  });
});
crone.schedule("0 10 * * * *", async () => {
  const channelsAll: any = await Channel.findAll();
  for (let i = 0; i < channelsAll.length; i++) {
    const chan = await channelsAll[i].dataValues.news_id;
    console.log(chan);
    console.log("hay hay");
    if (!chan) {
      const newsChannel = await News.findAll({
        order: [["date", "DESC"]],
      });
      Channel.update(
        { news_id: newsChannel[0].dataValues.id },
        { where: { telegram_id: channelsAll[i].dataValues.telegram_id } }
      );

      for (let j = 0; j < 10; j++) {
        // const element = array[i];
        if (newsChannel[j].dataValues.turi == "2") {
          const titleString: string = String(
            await getTitleStr(newsChannel[j].dataValues.description)
          );
          SendMessage(
            bot,
            channelsAll[i].dataValues.telegram_id,
            newsChannel[j].dataValues.imageUrl,
            newsChannel[j].dataValues.title,
            newsChannel[j].dataValues.description,
            titleString
          );
        } else {
          SendMessage(
            bot,
            channelsAll[i].dataValues.telegram_id,
            newsChannel[j].dataValues.imageUrl,
            newsChannel[j].dataValues.title,
            newsChannel[j].dataValues.description,
            newsChannel[j].dataValues.titleStr
          );
        }
        //bu yerda funksiya bo'ladi va u kerakli yangilikni jo'natadi
      }
    } else {
      const news = await News.findOne({
        where: {
          id: chan,
        },
      });

      const newsNew = await News.findAll({
        where: {
          date: {
            [db.Op.gt]: news.dataValues.date,
          },
        },
        order: [["date", "ASC"]],
      });
      console.log(newsNew);
      console.log("ishla jjj");
      if (newsNew.length > 0) {
        Channel.update(
          { news_id: newsNew[0].dataValues.id },
          { where: { telegram_id: channelsAll[i].dataValues.telegram_id } }
        );
        for (let k = 0; k < 1; k++) {
          if (newsNew[k].dataValues.turi == "2") {
            const titleString: string = String(
              await getTitleStr(newsNew[k].dataValues.description)
            );
            SendMessage(
              bot,
              channelsAll[i].dataValues.telegram_id,
              newsNew[k].dataValues.imageUrl,
              newsNew[k].dataValues.title,
              newsNew[k].dataValues.description,
              titleString
            );
          } else {
            SendMessage(
              bot,
              channelsAll[i].dataValues.telegram_id,
              newsNew[k].dataValues.imageUrl,
              newsNew[k].dataValues.title,
              newsNew[k].dataValues.description,
              newsNew[k].dataValues.titleStr
            );
          }
          //bu yerda funksiya bo'ladi va u kerakli yangilikni jo'natadi
        }
      }
    }
  }
});
crone.schedule("0 30 * * * *", async () => {
  console.log(cli.red("update qilyapti"));
  update();
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
      console.log(newsChannel);
      Channel.update(
        { news_id: newsChannel[0].dataValues.id },
        { where: { telegram_id: id } }
      );

      for (let i = 0; i < 10; i++) {
        // const element = array[i];
        SendMessage(
          ctx,
          id,
          newsChannel[i].dataValues.imageUrl,
          newsChannel[i].dataValues.title,
          newsChannel[i].dataValues.description,
          newsChannel[i].dataValues.titleStr
        );
        //bu yerda funksiya bo'ladi va u kerakli yangilikni jo'natadi
      }
    } else {
      const channelnew = await Channel.findOne({
        where: { telegram_id: id },
      });
      const newsUpdate = await News.findOne({
        where: { id: channelnew.dataValues.news_id },
      });

      const newsChan = await News.findAll({
        where: {
          date: {
            [db.Op.gte]: newsUpdate.date,
          },
        },
        order: [["date", "DESC"]],
      });

      if (newsChan.length > 0) {
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
            await SendMessage(
              ctx,
              id,
              newsChan[i].dataValues.imageUrl,
              newsChan[i].dataValues.title,
              newsChan[i].dataValues.description,
              newsChan[i].dataValues.titleStr
            );
          }
        } else {
          ctx.telegram.SendMessage(id, "Yangiliklar yoq");
        }
      } else {
        console.log(cli.red("nimadurlare"));
        ctx.telegram.sendMessage(id, "Yangiliklar yoq", {
          replay_to_message_id: messageId,
        });
      }
    }
  }
});
bot.hears("music", async (ctx: any) => {
  ctx.reply(
    "There is no music here. How many times do I have to say there are news that there is no music"
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
      ` I got kicked out of your @${name} channel`
    );
  }
  if (test == "administrator" && objUser) {
    ctx.telegram.sendMessage(userid, `I joined your channel @${name}`);
  }
});
bot.catch((err: any, ctx: any) => {
  const admin: number = Number(process.env.mainAdmin);
  ctx.telegram.sendMessage(admin, err.message);
});
bot.launch();
