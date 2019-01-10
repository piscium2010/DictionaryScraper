const db = require('./db');
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
    console.log(`fetched page`)
    const $ = cheerio.load(html)

    let links = new Set()
    $('a').each(function (i, elem) {
      let href = $(this).attr('href')
      let regEx = /^\//;
      let hasDate = /\d\d\d\d\/\d\d\/\d\d/;
      if (href && regEx.test(href) && hasDate.test(href)) {
        links.add(path.join(base, href))
      }
    });
    //let queue = new Array(links)
    //console.log(`queue`, queue)

    //const href = $('.teaser__link').attr('href')
    let words = new Set()
    for (let link of links) {
      await page.goto(link, { waitUntil: 'domcontentloaded' })
      const articalHtml = await page.content()
      console.log(`fetched artical - `, link)
      for(let w of breakwords(articalHtml)) {
        words.add(w)
      }
    }
    console.log(`size`,words.size)
    browser.close()
    await saveWords(Array.from(words))
    process.exit(0)
  } catch (err) {
    console.log(`err`, err)
    process.exit(1)
  }

})()

function breakwords(html) {
  const $ = cheerio.load(html)
  let text = ''

  $('p').each(function () {
    text += $(this).text() + ','
  })

  let words = br.breakwords(text)
  //console.log(`fetch ${words.length} words`)
  return words
}

async function saveWords(words) {
  for (let i = 0; i < words.length; i++) {
    let w = words[i]
    let document = { word: w.toLowerCase(), status: 0 }
    let id = { word: w.toLowerCase() }
    await db.upSert('words', document, id, false/* autoClose */)
  }
  db.close()
}