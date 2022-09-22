import axios from "axios";
import Cheerio from "cheerio";
import { title } from "process";
const getUrl = async (url: string) => {
  let data: { data: string } = await axios.get(url);
  return data.data;
};
interface Data {
  title: string; // kamroq bo'ladi
  imageUrl: string; // url bo'ladi
  description: string; //bu ham url bo'ladi faqat to'liqroq
  date: number; //bu qachon maqola chiqarilganligi haqida
}

const getTimeNews: (url: string) => void = async (url) => {
  const data: string = await getUrl(url);
  let vaqt: number = 111111111111;
  const $ = Cheerio.load(data);

  $(".datetime.flex.middle-xs").each((__, e1) => {
    let time: string = $(e1).text().trim();
    // console.log(time);
    if (time.includes("h") && time.length <= 4) {
      let hour: number = Number(time.split("h")[0]);
      let date: Date = new Date();
      date.setHours(date.getHours() - hour);
      vaqt = Number(date.getTime());
      //  console.log("soat");
    } else {
      if (time.includes("m") && time.length <= 4) {
        let minutes: number = Number(time.split("m")[0]);
        let date: Date = new Date();
        date.setMinutes(date.getMinutes() - minutes);
        vaqt = Number(date.getTime());
        //console.log("minut");
      } else {
        const timeD: Date = new Date(String(time.split(",")[0]));
        let date = new Date(timeD);
        vaqt = Number(date.getTime());
      }
    }
  });
  let result: number = vaqt;
  // console.log(result);
  return result;
};
const getData = async (num: number = 1) => {
  const url = `https://cryptonews.net/?page=${num}`;
  const data: string = await getUrl(url);
  const $ = Cheerio.load(data);
  const baseUrl: string = `https://cryptonews.net`;
  let arr: {
    title: string; // kamroq bo'ladi
    imageUrl: string; // url bo'ladi
    description: string; //bu ham url bo'ladi faqat to'liqroq
    date: number;
  }[] = [];
  $(".row.news-item.start-xs").each((_, e) => {
    let obj = {} as Data;
    obj.title = String($(e).attr("data-title"));
    obj.description = String(baseUrl + $(e).attr("data-id"));
    obj.imageUrl = String($(e).attr("data-image"));
    arr.push(obj);
  });

  for (let i = 0; i < arr.length; i++) {
    arr[i].date = Number(await getTimeNews(arr[i].description));
  }
  console.log(arr); // u yerda yangililklar ma'lumotlar yangilandi
};
getData();
//

export { getData, getTimeNews };
