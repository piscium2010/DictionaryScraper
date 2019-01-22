const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const request = require('request');
const util = require('util');
const br = require('./breakwords');
const sw = require('./savewords');

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
const iframe = page.mainFrame().childFrames()[0]
const nextPageBtn = await iframe.$$(".kindleReader_arrowBtn")
//const nextPageBtn = await iframe.$("div[title='Next Page']")  // kindleReader_arrowBtn
await nextPageBtn[1].click()
let i = 0

while(nextPageBtn[1] && i < 10) {
  for(const contentFrame of iframe.childFrames()) {
    //let id = await contentFrame.content()
    let words = new Set()
    let text = await contentFrame.$eval('body', el => el.textContent)
    for(let w of br.breakwords(text)) {
      words.add(w)
    }
    try {
      await sw.saveWords(Array.from(words))
    } catch(e) {
      sw.close()      
    }
    //let 
    //console.log(`id`,text[0])
  }
  const nextPageBtn = await iframe.$$(".kindleReader_arrowBtn")
  await nextPageBtn[1].click()
  console.log(`click`,  i++)
  await delay(3000)
}

await sw.close()

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