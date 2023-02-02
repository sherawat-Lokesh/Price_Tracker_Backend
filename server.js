import * as cheerio from "cheerio";
import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const obj = {
  amazon:'.priceToPay > span:nth-child(2) > span.a-price-whole',
  amazonImage: "#landingImage",
  flipkart:"div._30jeq3._16Jk6d",
  flipkartImage: "._3nMexc > img",
};

app.post("/info", (req, res) => {
  var data = req.body;
  if (data === []) return res.status(400).json("Something went wrong!");

  const responseArr = [];
  data.forEach((element, i) => {
    element.site === "flipkart"
      ? responseGiver(
          element.url,
          element.site,
          element.finalprice,
          obj["flipkart"],
          obj["flipkartImage"]
        )
      : element.site === "amazon"
      ? responseGiver(
          element.url,
          element.site,
          element.finalprice,
          obj["amazon"],
          obj["amazonImage"]
        )
      : "";

    async function responseGiver(url, site, finalprice, find, imglink) {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);
      const pricess = $(find).text().replace(/[₹,.]/g, "");
      const imagess = $(imglink).attr("src");
      console.log(imagess);
      if (!pricess || pricess == "") {
        responseGiver(url, site, finalprice, find, imglink);
        return;
      }

      responseArr.push({
        yourPrice: finalprice,
        currentPrice: pricess,
        buyLink: url,
        webiste: site,
        imageLink: imagess,
      });
      console.log(finalprice);
      if (data.length === responseArr.length) {
        res.status(200).json(responseArr);
        return;
      }
    }
  });
});

app.listen(process.env.PORT || 69, () => {
  console.log("server is working on port 69");
});
