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
            if (href && regEx.test(href)) {
                links.add(path.join(base, href))
            }
        });
        let queue = new Array(links)
        console.log(`queue`,queue)


        await browser.close()
        process.exit(0)
    } catch (err) {
        console.log(`err`, err)
        process.exit(1)
    }

})()
