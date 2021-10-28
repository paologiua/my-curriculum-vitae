const express = require("express");
const path = require('path');
const puppeteer = require('puppeteer');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/cv.pdf', async (req, res) => {
  const pdf = await getPDF(port, req.query);
  res.send(pdf);
})

app.get('/cv.png', async (req, res) => {
  const png = await getPNG(port, req.query);
  res.send(png);
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + req.path));
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})

async function getPDF(port, options) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:' + port);

  if(options.dark == 'true')
    await page.click('#dark-button');
  if(options.rounded == 'true')
    await page.click('#rounds-button');

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();
  return pdf;
}

async function getPNG(port, options) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:' + port);

  if(options.dark == 'true')
    await page.click('#dark-button');
  if(options.rounded == 'true')
    await page.click('#rounds-button');
  await page.addStyleTag({content: `
    * {
      transition: none !important;
    }

    html {
      background-color: transparent !important;
    }
  
  `});

  await page.emulateMediaType('print');
  const png = await page.screenshot({ 
    fullPage: true
  });

  await browser.close();
  return png;
}