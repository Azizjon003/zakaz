import axios from "axios";
import Cheerio from "cheerio";
import { title } from "process";
import * as fs from "fs";
interface Data {
  title: string; // kamroq bo'ladi
  imageUrl: string; // url bo'ladi
  description: string; //bu ham url bo'ladi faqat to'liqroq
  date: number; //bu qachon maqola chiqarilganligi haqida
  titleStr: string; // qisqacha description
}
let getData = async (url: string, num: number) => {
  let mainUrl = "https://cointelegraph.com/news/";
  const data = await axios.post(url, {
    operationName: "MainPagePostsQuery",
    variables: {
      offset: (num - 1) * 15,
      length: num * 15,
      short: "en",
      cacheTimeInMS: 1000,
    },
    query:
      'query MainPagePostsQuery($short: String, $offset: Int!, $length: Int!, $place: String = "index") {\n  locale(short: $short) {\n    posts(\n      order: "postPublishedTime"\n      offset: $offset\n      length: $length\n      place: $place\n    ) {\n      data {\n        cacheKey\n        id\n        slug\n        postTranslate {\n          cacheKey\n          id\n          title\n          avatar\n          published\n          publishedHumanFormat\n          leadText\n          author {\n            cacheKey\n            id\n            slug\n            authorTranslates {\n              cacheKey\n              id\n              name\n            }\n          }\n        }\n        category {\n          cacheKey\n          id\n          slug\n          categoryTranslates {\n            cacheKey\n            id\n            title\n          }\n        }\n        author {\n          cacheKey\n          id\n          slug\n          authorTranslates {\n            cacheKey\n            id\n            name\n          }\n        }\n        postBadge {\n          cacheKey\n          id\n          label\n          postBadgeTranslates {\n            cacheKey\n            id\n            title\n          }\n        }\n      }\n      postsCount\n      hasMorePosts\n    }\n  }\n}\n',
  });
  console.log(data.data);

  const malumot: {
    data: {
      locale: {
        posts: {
          data: {
            slug: string;
            postTranslate: {
              title: string;
              avatar: string;
              published: Date;
              leadText: string;
            };
          }[];
        };
      };
    };
  } = data.data;
  let parser = malumot.data.locale.posts.data;
  let arr: {
    title: string;
    description: string;
    date: number;
    imageUrl: string;
    titleStr: string;
  }[] = [];
  for (let i = 0; i < parser.length; i++) {
    let obj = {} as Data;
    obj.title = parser[i].postTranslate.title;
    obj.description = mainUrl + parser[i].slug;
    obj.date = new Date(parser[i].postTranslate.published).getTime();
    obj.imageUrl = parser[i].postTranslate.avatar;
    obj.titleStr = parser[i].postTranslate.leadText;
    arr.push(obj);
  }
  console.log(arr);
  return arr;
};
const getParserThree = async (num: number) => {
  let datt = await getData("https://graphcdn.cointelegraph.com/", num);
  return datt;
};
export { getParserThree };
