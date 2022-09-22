import axios from "axios";
import Cheerio from "cheerio";
import { title } from "process";
import * as fs from "fs";
let getData: (url: string) => void = async (url) => {
  const data = await axios.post(url, {
    operationName: "MainPagePostsQuery",
    variables: {
      offset: 0,
      length: 10,
      short: "en",
      cacheTimeInMS: 1000,
    },
    query:
      'query MainPagePostsQuery($short: String, $offset: Int!, $length: Int!, $place: String = "index") {\n  locale(short: $short) {\n    posts(\n      order: "postPublishedTime"\n      offset: $offset\n      length: $length\n      place: $place\n    ) {\n      data {\n        cacheKey\n        id\n        slug\n        postTranslate {\n          cacheKey\n          id\n          title\n          avatar\n          published\n          publishedHumanFormat\n          leadText\n          author {\n            cacheKey\n            id\n            slug\n            authorTranslates {\n              cacheKey\n              id\n              name\n            }\n          }\n        }\n        category {\n          cacheKey\n          id\n          slug\n          categoryTranslates {\n            cacheKey\n            id\n            title\n          }\n        }\n        author {\n          cacheKey\n          id\n          slug\n          authorTranslates {\n            cacheKey\n            id\n            name\n          }\n        }\n        postBadge {\n          cacheKey\n          id\n          label\n          postBadgeTranslates {\n            cacheKey\n            id\n            title\n          }\n        }\n      }\n      postsCount\n      hasMorePosts\n    }\n  }\n}\n',
  });

  const malumot = JSON.stringify(data.data);
  console.log(malumot);
  fs.writeFile(malumot, __dirname + "/index.txt", () => {});
  return data.data;
};

getData("https://graphcdn.cointelegraph.com");
