import { CronJob } from "cron";
import dotenv from "dotenv";
dotenv.config();

import { parseCommandLineArgs } from './utils/parseCommandLineArgs';

import {
  getRakutenRankingDataByGenre,
  getRakutenRankingDataByKeyword,
} from "./services/getRakutenRankingData";

import getGenreIdsByTime from "./utils/getGenreIdsByTime";
import getNumberToday from "./utils/getNumberToday";
import postRakutenRoom from "./services/postRakutenRoom";

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
