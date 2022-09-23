import axios from "axios";
import * as fs from "fs";
import Cheerio from "cheerio";
const getData = async (url: string) => {
  const data: { data: string } = await axios.get(url);
  return data.data;
};
interface Data {
  title: string;
  imageUrl: string;
  description: string;
  date: number;
}
const getParser = async () => {
  const url = `https://cryptonews.com/news`;
  const data: string = await getData(url);
  const $ = Cheerio.load(data);
  let arr: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
  }[] = [];
  $(".mb-15.mb-sm-30.article-item").each((_, e) => {
    let obj = {} as Data;
    let imagUrl: string = String($(e).find("img").attr("src"));
    const title: string = String(
      $(e)
        .find(
          ".article__title.article__title--lg.article__title--featured.mb-20"
        )
        .text()
    );
    const description: string = String(
      url +
        $(e)
          .find(
            ".article__title.article__title--lg.article__title--featured.mb-20"
          )
          .attr("href")
    );
    const date = new Date(
      String($(e).find(".article__badge-date").attr("data-utctime"))
    );

    date.setTime(date.getTime() + 1000 * 60 * 60 * 5);
    const vaqt: number = Number(date.getTime());
    obj.title = title;
    obj.description = description;
    obj.imageUrl = imagUrl;
    obj.date = vaqt;
    arr.push(obj);
  });
  $(".col-12.col-md-6.col-lg-4.col-xl-3.mb-30").each((_, e) => {
    let obj = {} as Data;
    let imagUrl: string = String($(e).find("img").attr("data-src"));
    const title: string = String($(e).find("h4").text());
    const description: string = String(
      url +
        $(e)
          .find(".article__title.article__title--md.article__title--featured")
          .attr("href")
    );
    const date = new Date(
      String($(e).find(".article__badge-date").attr("data-utctime"))
    );

    date.setTime(date.getTime() + 1000 * 60 * 60 * 5);
    const vaqt: number = Number(date.getTime());
    obj.title = title;
    obj.description = description;
    obj.imageUrl = imagUrl;
    obj.date = vaqt;
    arr.push(obj);
  });

  return arr;
};

// getData("https://cryptonews.com/news/");
export { getParser };
