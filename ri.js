const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let $

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ldoceonline.com/dictionary/bee', { waitUntil: 'domcontentloaded' })
    await page.screenshot({ path: 'dic.png' });
    const html = await page.content()

    $ = cheerio.load(html)
    $('.dictentry').each(function () {
      const entry = $(this)
      const result = parseEntry(entry)
      //console.log(`result`, result)
      return result
    })
    let simpleForms = parseFormTable($('table[class=simpleForm]'))
    let continuousForms = parseFormTable($('table[class=continuousForm]'))
    console.log(`simpleForms`,simpleForms)
    console.log(`continuousForms`,continuousForms)

    await browser.close();
  } catch (err) {
    console.log(`err`, err)
  }

})();

function text(selector, container) {
  let element = container.find(selector)
  return element && element.text ? element.text() : ''
}

function map(selector, fn, container) {
  let elements = container.find(selector)
  return elements ? elements.map(fn).get() : []
}

function parseEntry(entry) {
  const word = text('.HWD', entry)
  const pronounce = text('.PronCodes', entry)
  const pos = text('.Head .POS', entry)
  const inflections = text('.Head .Inflections', entry)
  const gram = text('.Head .GRAM', entry)
  const registerlab = text('.REGISTERLAB', entry)
  const sentences = map('.Sense', function () {
    let sentence = $(this)
    let def = text('.DEF', sentence)
    let gram = text('.GRAM', sentence)
    let examples = map('.EXAMPLE', function () { return ($(this).text()) }, sentence)
    return { gram, registerlab, def, examples }
  }, entry)

  return Object.assign({},
    word ? { word } : null,
    pronounce ? { pronounce } : null,
    pos ? { pos } : null,
    inflections ? { inflections } : null,
    gram ? { gram } : null,
    { sentences }
  )
}

function parseFormTable(table) {
  let mapper = function() {
    let tr = $(this)
    let aux = text('.aux', tr)
    let form = text('.verb_form', tr)
    return form || aux
  }
  let verbForms = table ? map('tr', mapper, table) : []
  let distinct = Array.from(new Set(verbForms))
  return distinct.filter(i => i)
}
