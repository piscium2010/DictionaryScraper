const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const request = require('request');
const util = require('util');
(async() => {
//const URL = 'https://www.chromestatus.com/features';
const URL = 'https://read.amazon.com/';
const opts = {
  chromeFlags: [],
  logLevel: 'info',
  output: 'json',
  userDataDir: '/Users/ssc/library/Application Support/google/chrome/default',
  startingUrl: URL
  //chromePath: '/Users/ssc/DictionaryScraper/node_modules/puppeteer/.local-chromium/mac-564778/chrome-mac'
};
// Launch chrome using chrome-launcher.
const chrome = await chromeLauncher.launch(opts);
opts.port = chrome.port;
// Connect to it using puppeteer.connect().
const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
console.log(`port`,`http://localhost:${opts.port}/json/version`)
const {webSocketDebuggerUrl} = JSON.parse(resp.body);

const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
await delay(10000)
const pages = await browser.pages()
const page = pages[0]
const frame = await page.mainFrame()
const divsCounts = await frame.$$('#kindleReader_book_container')
console.log(`html`,divsCounts)

// Run Lighthouse.
//const {lhr} = await lighthouse(URL, opts, null);
//console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => `${c.title} ${c.score}`).join(', ')}`);
await browser.disconnect();
//await chrome.kill();
})();

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}