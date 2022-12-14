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
  titleStr: string;
}
const getGetTitleStr = async (url: string) => {
  const data: string = await getData(url);
  const $ = Cheerio.load(data);
  let son: number = 1;
  let titleStr: string = "";
  $(".article-single__content.category_contents_details")
    .children("p")
    .each((_, e) => {
      son++;
      if (son == 3) {
        titleStr = $(e).text();
      }
    });
  console.log(titleStr);
  return titleStr;
};
const getParser = async () => {
  const url = `https://cryptonews.com/`;
  const mainurl = "https://cryptonews.com/news";
  const data: string = await getData(mainurl);
  const $ = Cheerio.load(data);
  let arr: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
    titleStr: string;
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
    const titleStr: string = $(e)
      .find(".mb-25.d-none.d-md-block")
      .text()
      .trim();

    date.setTime(date.getTime() + 1000 * 60 * 60 * 5);
    const vaqt: number = Number(date.getTime());
    obj.title = title;
    obj.description = description;
    obj.imageUrl = imagUrl;
    obj.date = vaqt;
    obj.titleStr = titleStr;
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
    const titleStr: string = $(e).find(".post-card-inline__text").text().trim();

    date.setTime(date.getTime() + 1000 * 60 * 60 * 5);
    const vaqt: number = Number(date.getTime());
    obj.title = title;
    obj.description = description;
    obj.imageUrl = imagUrl;
    obj.date = vaqt;
    obj.titleStr = titleStr;
    arr.push(obj);
  });

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].titleStr)
      arr[i].titleStr = await getGetTitleStr(arr[i].description);
  }
  console.log(arr);
  return arr;
};

export { getParser };
