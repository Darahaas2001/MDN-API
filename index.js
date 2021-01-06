const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const request = require("request-promise");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    let query = req.query.q;
    query = encodeURIComponent(query);
    const Data = await request({
      uri: `https://developer.mozilla.org/en-US/search?q=${query}`,

      gzip: true,
    });
    //console.log(Data);
    const $ = await cheerio.load(Data);
    let len = $("div[class=result]").length;
    let title, data, link;
    let arr = [];
    for (let i = 2; i <= len + 1; i++) {
      title = $(
        `div.result-container:nth-child(${i}) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)`
      )
        .text()
        .trim();

      data = $(
        `div.result-container:nth-child(${i}) > div:nth-child(1) > div:nth-child(2)`
      )
        .text()
        .trim();
      link = $(
        `div.result-container:nth-child(${i}) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)`
      ).attr("href");
      link = "https://developer.mozilla.org" + link;

      arr.push({ title, data, link });
    }
    await res.status(200).json(arr);

    //console.log("Scraped", scraped);
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log("App is listerning on PORT :", process.env.PORT);
});
