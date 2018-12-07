const db = require('./db')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const base = 'https://www.economist.com';
const br = require('./breakwords');


(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0)

    await page.goto(base, { waitUntil: 'domcontentloaded' })
    const html = await page.content()
    console.log(`fetched page`,)
    const $ = cheerio.load(html)
    const href = $('.teaser__link').attr('href')

    const articalUrl = path.join(base, href)
    await page.goto(articalUrl, { waitUntil: 'domcontentloaded' })
    const articalHtml = await page.content()
    console.log(`fetched artical`,)
    await breakwords(articalHtml)

    await browser.close()
  } catch (err) {
    console.log(`err`, err)
  }

})()

async function breakwords(html) {
  const $ = cheerio.load(html)
  const blog = $('.blog-post__text').text()
  const words = br.breakwords(blog)
  console.log(`fetch ${words.length} words`)

  for (let i = 0; i < words.length; i++) {
        let w = words[i]
        let document = { word: w.toLowerCase(), status: 0 }
        let id = { word: w.toLowerCase() }
        await db.upSert('words', document, id, false/* autoClose */)
  }
  db.close()
}