import { getData } from "../parsing/twositeParser";
import { getParser } from "../parsing/onesiteParser";
import { getParserThree } from "../parsing/threesiteParser";
import cli from "cli-color";
const db = require("../model/index");
const news = db.news;
console.log(db);
const updateTwoParser = async (model: any) => {
  const data = await model.findAll({
    where: {
      turi: "2",
    },
    order: [["date", "DESC"]],
  });
  let test: number = data[0].dataValues.date;
  let shart: boolean = true;
  let son: number = 1;
  let mainArr: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
    turi?: string;
  }[] = [];
  while (shart) {
    let arr: {
      title: string;
      imageUrl: string;
      description: string;
      date: number;
    }[] = await getData(son);
    console.log(cli.blue("sihaladabas"));
    let arr2: {
      title: string;
      imageUrl: string;
      description: string;
      date: number;
      turi?: string;
    }[] = arr.sort((a, b) => {
      return b.date - a.date;
    });
    if (arr2[0].date >= test) {
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i].date > test) {
          arr2[i].turi = "2";
          mainArr.push(arr2[i]);
        }
      }
    } else {
      shart = false;
    }
    son++;
  }
  for (let i = 0; i < mainArr.length; i++) {
    let son = await model.create(mainArr[i]);
    console.log(cli.blue(`${i + 1} eleamnt bazaga qo'shildi => ${son}`));
  }
};
const updateOneParser = async (model: any) => {
  const data = await model.findAll({
    where: {
      turi: "1",
    },
    order: [["date", "DESC"]],
  });
  const test: number = data[0].dataValues.date;
  // const test: number = new Date().getTime() - 24 * 60 * 60 * 1000;
  let shart: boolean = true;
  let son: number = 1;
  let mainArr: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
    turi?: string;
  }[] = [];
  // while (shart) {
  let arr: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
    turi?: string;
  }[] = await getParser();
  // console.log(arr);
  let arr2: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
    turi?: string;
  }[] = arr.sort((a, b) => {
    return b.date - a.date;
  });
  if (arr2[0].date > test) {
    for (let i = 0; i < arr2.length; i++) {
      if (arr2[i].date > test) {
        arr2[i].turi = "1";
        mainArr.push(arr2[i]);
      }
    }
  } else {
    shart = false;
  }
  // }

  console.log(cli.red("e Xurshid kalla"));
  console.log(mainArr);
  for (let j = 0; j < mainArr.length; j++) {
    console.log(cli.red("e Xurshid kalla create"));
    let son = await model.create(mainArr[j]);
    console.log(cli.blue(`${j + 1} eleamnt bazaga qo'shildi => ${son}`));
  }
};
const updateThreeParser = async (model: any) => {
  const data = await model.findAll({
    where: {
      turi: "3",
    },
    order: [["date", "DESC"]],
  });
  const test: number = data[0].dataValues.date;
  // const test = new Date().getTime() - 5 * 60 * 60 * 1000;
  let shart: boolean = true;
  let son: number = 1;
  let mainArr: {
    title: string;
    imageUrl: string;
    description: string;
    date: number;
    turi?: string;
  }[] = [];

  while (shart) {
    let arr: {
      title: string;
      imageUrl: string;
      description: string;
      date: number;
      turi?: string;
    }[] = await getParserThree(son);
    let arr2: {
      title: string;
      imageUrl: string;
      description: string;
      date: number;
      turi?: string;
    }[] = arr.sort((a, b) => {
      return b.date - a.date;
    });
    if (arr2[0].date > test) {
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i].date > test) {
          arr2[i].turi = "3";
          mainArr.push(arr2[i]);
        }
      }
    } else {
      shart = false;
    }
    son++;
  }
  // console.log(mainArr);
  for (let j = 0; j < mainArr.length; j++) {
    console.log(cli.red("e Xurshid kalla create"));
    console.log(mainArr[j]);
    let son = await model.create(mainArr[j]);
    console.log(cli.blue(`${j + 1} eleamnt bazaga qo'shildi => ${son}`));
  }
};

const update = async () => {
  // await updateTwoParser(news);
  await updateOneParser(news);
  await updateThreeParser(news);
};
export { update };
