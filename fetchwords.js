const db = require('./db')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const base = 'https://www.economist.com';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(base, { waitUntil: 'domcontentloaded' })
    const html = await page.content()
    const $ = cheerio.load(html)
    const href = $('.teaser__link').attr('href')

    const articalUrl = path.join(base, href)
    await page.goto(articalUrl, { waitUntil: 'domcontentloaded' })
    const articalHtml = await page.content()
    breaktowords(articalHtml)

    await browser.close()
  } catch (err) {
    console.log(`err`, err)
  }

})()

function breaktowords(html) {
  const $ = cheerio.load(html)
  const blog = $('.blog-post__text').text()
  const wordRegex = /\w{1,}/g

  const words = blog.match(wordRegex)
  words.forEach(w => {
    let document = { word: w.toLowerCase() }
    let id = { word: w.toLowerCase() }
    db.upSert('words', document, id)
  })
}