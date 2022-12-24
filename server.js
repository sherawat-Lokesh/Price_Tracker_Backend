import * as cheerio from "cheerio";
import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const obj = {
  amazon:
    "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole",
  flipkart:
    "#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-8-12 > div:nth-child(2) > div > div.dyC4hf > div.CEmiEU > div > div._30jeq3._16Jk6d",
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
          obj["flipkart"]
        )
      : element.site === "amazon"
      ? responseGiver(
          element.url,
          element.site,
          element.finalprice,
          obj["amazon"]
        )
      : "";

    async function responseGiver(url, site, giveprice, find) {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);
      const pricess = $(find).text().replace(/[₹,.]/g, "");
      if (!pricess || pricess == "") {
        responseGiver(url, site, giveprice, find);
        return;
      }
      responseArr.push({
        buyLink: url,
        webiste: site,
        currentPrice: pricess,
        givenPrice: giveprice,
      });
      console.log(pricess);
      if (data.length === i) {
        res.status(200).json(responseArr);
        return;
      }
    }
  });
});

app.listen(process.env.PORT || 69, () => {
  console.log("server is working on port 69");
});
