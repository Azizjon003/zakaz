import axios from "axios";
import * as fs from "fs";
async function ishla(url: string) {
  const data = await axios.get(url);
  console.log(data.data);
  fs.writeFile(__dirname + "/index.html", data.data, () => {});
}
ishla("https://cointelegraph.com/tags/altcoin");
