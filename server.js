import * as cheerio from 'cheerio';
import fetch from 'node-fetch'
import express from 'express';
import bodyParser from 'body-parser';


const app=express();
app.use(bodyParser.json());

const obj={
    amazon:'span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2) > span.a-price-whole',
    flipkart:'div._30jeq3._16Jk6d'
}

app.post('/info',(req,res)=>{
///////////////////////////////////////////////////////////////////////////////////////////////////////////
const {url,finalprice,site}=req.body;
    if(!url && !downPrice)return res.status(400).json('Something went wrong!');

site==='flipkart' ?giveResponse(url,finalprice,obj["flipkart"]) : site==='amazon'?giveResponse(url,finalprice,obj["amazon"]):'';
    async  function  giveResponse(url,price,find){
        try{
            const link=url ;
            const response=await fetch(link);
            const body=await response.text();
            const $= cheerio.load(body);
                const prices=  $(find).text().replace(/[₹,.]/g, '') // price nikal liya
                console.log(url,prices,find)
            if(prices!==''){if(+prices <= +price)return res.json({prices,site,url})}
            if(prices ===''){giveResponse(url,prices,find);return};

        }catch(err){
                console.error(err);
            }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
})

app.listen(process.env.PORT || 69,()=>{
    console.log(`listening on port ${process.env.PORT || 69}`)
})