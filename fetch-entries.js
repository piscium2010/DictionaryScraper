const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV']
let $

(async () => {
  try {
    if (fs.existsSync('dic.txt')) {
      fs.writeFileSync('dic.txt', '')
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ldoceonline.com/dictionary/wear', { waitUntil: 'domcontentloaded' })
    //await page.screenshot({ path: 'dic.png' });
    const html = await page.content()

    $ = cheerio.load(html)
    $('.dictentry').each(function (i) {
      const entry = $(this)
      const result = parseEntry(entry)
      if (i == 0) {
        let simpleForms = parseFormTable($('table[class=simpleForm]'))
        let continuousForms = parseFormTable($('table[class=continuousForm]'))
        Object.assign(result, { forms: simpleForms.concat(continuousForms) })
      }
      writeEntry(result)
      //console.log(`result`,result)
      return result
    })
    await browser.close();
  } catch (err) {
    console.log(`err`, err)
  }

})();

function text(selector, container) {
  let element = container.find(selector)
  return element && element.text ? element.text().trim() : ''
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
    let lexunit = text('.LEXUNIT', sentence)
    let def = text('.DEF', sentence)
    let gram = text('.GRAM', sentence)
    let examples = map('.EXAMPLE', function () { return ($(this).text().trim().replace('\n', '')) }, sentence)
    return { gram, registerlab, lexunit, def, examples }
  }, entry)

  return Object.assign({},
    word ? { word } : null,
    pronounce ? { pronounce } : null,
    pos ? { pos } : null,
    inflections ? { inflections } : null,
    gram ? { gram } : null,
    { sentences: sentences.filter(s => s.examples.length > 0) }
  )
}

function parseFormTable(table) {
  let mapper = function () {
    let tr = $(this)
    let aux = text('.aux', tr)
    let form = text('.verb_form', tr)
    return form || aux
  }
  let verbForms = table ? map('tr', mapper, table) : []
  let distinct = Array.from(new Set(verbForms))
  return distinct.filter(i => i)
}

function writeEntry(entry) {
  const {
    word,
    pronounce = '',
    pos = '',
    inflections = '',
    gram = '',
    sentences = [],
    forms = []
  } = entry

  let words = [word].concat(forms)
  words = Array.from(new Set(words))

  words.forEach(function (w, index) {
    let _forms = pos == 'verb' && forms.length > 0 ? `[${forms.slice(1).join(' ')}]` : ''
    let line = `${w}\t${pronounce}${pos}${_forms}${inflections}${gram}`

    sentences.forEach((s, j) => {
      let {
        gram = '',
        registerlab = '',
        lexunit = '',
        def = '',
        examples = []
      } = s
      
      line += `\\n\\n${roman[j]} ${gram}${registerlab}\\n${lexunit ? lexunit + ';' : lexunit} ${def}`

      examples.forEach((example, n) => {
        line += `\\n${n + 1}. ${example}`
      })
    })
    fs.appendFileSync('dic.txt', line + '\n')
    //console.log(`line`,line)
  })
}
