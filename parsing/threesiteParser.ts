import axios from "axios";
import Cheerio from "cheerio";
import { title } from "process";
import * as fs from "fs";
interface Data {
  title: string; // kamroq bo'ladi
  imageUrl: string; // url bo'ladi
  description: string; //bu ham url bo'ladi faqat to'liqroq
  date: number; //bu qachon maqola chiqarilganligi haqida
}
let getData: (url: string) => void = async (url) => {
  const data = await axios.post(url, {
    operationName: "MainPagePostsQuery",
    variables: {
      offset: 0,
      length: 20,
      short: "en",
      cacheTimeInMS: 1000,
    },
    query:
      'query MainPagePostsQuery($short: String, $offset: Int!, $length: Int!, $place: String = "index") {\n  locale(short: $short) {\n    posts(\n      order: "postPublishedTime"\n      offset: $offset\n      length: $length\n      place: $place\n    ) {\n      data {\n        cacheKey\n        id\n        slug\n        postTranslate {\n          cacheKey\n          id\n          title\n          avatar\n          published\n          publishedHumanFormat\n          leadText\n          author {\n            cacheKey\n            id\n            slug\n            authorTranslates {\n              cacheKey\n              id\n              name\n            }\n          }\n        }\n        category {\n          cacheKey\n          id\n          slug\n          categoryTranslates {\n            cacheKey\n            id\n            title\n          }\n        }\n        author {\n          cacheKey\n          id\n          slug\n          authorTranslates {\n            cacheKey\n            id\n            name\n          }\n        }\n        postBadge {\n          cacheKey\n          id\n          label\n          postBadgeTranslates {\n            cacheKey\n            id\n            title\n          }\n        }\n      }\n      postsCount\n      hasMorePosts\n    }\n  }\n}\n',
  });

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
  }[] = [];
  for (let i = 0; i < parser.length; i++) {
    let obj = {} as Data;
    obj.title = parser[i].postTranslate.title;
    obj.description = parser[i].postTranslate.leadText;
    obj.date = new Date(parser[i].postTranslate.published).getTime();
    obj.imageUrl = parser[i].postTranslate.avatar;
    arr.push(obj);
  }
  console.log(arr);
};
getData("https://graphcdn.cointelegraph.com/");
export { getData };
