import { CronJob } from "cron";
import dotenv from "dotenv";
dotenv.config();

import { parseCommandLineArgs } from './parseCommandLineArgs';

import {
  getRakutenRankingDataByGenre,
  getRakutenRankingDataByKeyword,
} from "./getRakutenRankingData";

import getGenreIdsByTime from "./getGenreIdsByTime";
import getNumberToday from "./lib/getNumberToday";
import postRakutenRoom from "./postRakutenRoom"; // ✅ defaultインポートに修正

async function runJob() {
  const today = new Date();
  const currentHour = today.getHours();
  const targetGenres = getGenreIdsByTime(currentHour);
  if (targetGenres.length === 0) {
    console.log("対象ジャンルなし");
    return;
  }

  for (const genreId of targetGenres) {
    await main(getRakutenRankingDataByGenre, genreId);
  }
  console.log("End job:" + new Date().toLocaleString());
}

async function main(
  getRakutenRankingData: (genreOrKeyword: string, numberToday: number) => any,
  genreOrKeyword: string
) {
  const numberToday = getNumberToday();
  const elements = await getRakutenRankingData(genreOrKeyword, numberToday);
  await postRakutenRoom(elements); // ✅ 引数は1つ
  console.log("End job:" + new Date().toLocaleString());
}

const args = process.argv.slice(2);
const options = parseCommandLineArgs(args);

if (options.genre) {
  main(getRakutenRankingDataByGenre, options.genre);
} else if (options.keyword) {
  main(getRakutenRankingDataByKeyword, options.keyword);
} else {
  const job = new CronJob("0 0 * * * *", () => {
    console.log("Start job:" + new Date().toLocaleString());
    runJob();
  });
  job.start();
}
