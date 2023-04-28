const fs = require('fs')
const path = require('path')
const log = require('./log')
const showdown = require('showdown')

const HtmlConverter = new showdown.Converter()

function generateManufacturersList(input) {
    log.info('Generate manufactures list')
  
    let manufacturersList = []
  
    fs.readdirSync(input).forEach(manufacturer => { 
      if (fs.lstatSync(input + path.sep + manufacturer).isDirectory()) {
        manufacturersList.push(manufacturer)
      }
    })
  
    log.info(`${manufacturersList.length} manufacturers found`)
  
    return manufacturersList
}

function copyManufacturersLogo(input, output) {
    const manufacturersList = generateManufacturersList(input)
    const imgOutput = `${output}manufacturers`

    log.info('Copy manufacturer logo')

    if (!fs.existsSync(imgOutput)) {
        fs.mkdirSync(imgOutput, { recursive: true });
    }    

    manufacturersList.forEach(manufacturer => {
        fs.copyFileSync(`${input}/${manufacturer}/logo.png`, `${imgOutput}/${manufacturer}.png`)
        fs.copyFileSync(`${input}/${manufacturer}/logo_256x256.png`, `${imgOutput}/${manufacturer}_256x256.png`)
    })
}

function generateManufacturerDescription(input) {
  const manufacturersList = generateManufacturersList(input)
  let manufacturersHtml = {}

  manufacturersList.forEach(manufacturer => {
    const summaryFilename = `${input}/${manufacturer}/summary.md`

    if (fs.existsSync(summaryFilename)) {
      let content = fs.readFileSync(summaryFilename, 'utf8')
      // Add logo header
      content = `![${manufacturer}](./assets/manufacturers/${manufacturer}.png)\n\n${content}`

      manufacturersHtml[manufacturer] = HtmlConverter.makeHtml(content)
    }

  })

  return manufacturersHtml
}

module.exports = { generateManufacturersList, copyManufacturersLogo, generateManufacturerDescription }
