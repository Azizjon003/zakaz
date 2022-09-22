import { getData } from "../parsing/twositeParser";
import cli from "cli-color";
const db = require("../model/index");
const news = db.news;
console.log(db);
const updateTwoParser = async (model: any) => {
  //   const data = await model.findAll({
  //     where: {
  //       turi: "2",
  //     },
  //     order: [["date", "DESC"]],
  //   });
  let test: number = Number(new Date().getTime() - 4 * 60 * 60 * 1000);
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

const ishla = async () => {
  updateTwoParser(news);
};
ishla();
