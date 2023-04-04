const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/scrape', (req, res) => {
  let url = req.query.url ? req.query.url : "https://example.com";
    (async () => {
      // const browser = await puppeteer.launch({headless: false});
      const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      });
      const page = await browser.newPage();
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      const headers = JSON.stringify(response.headers());
      const content = await page.content();

      await browser.close();

      console.log("Request sent to: "+url);
      let result = '{"header":'+headers+',"body":'+JSON.stringify(content)+'}';
      res.send(JSON.parse(result))
      })();
  })

app.listen(PORT, () => {
  console.log(`ScrapeMaster listening on port ${PORT}`)
})
