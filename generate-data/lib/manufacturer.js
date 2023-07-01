const fs = require('fs')
const path = require('path')
const log = require('./log')
const showdown = require('showdown')

const HtmlConverter = new showdown.Converter()

function generateManufacturersOutputFolderName(basedir) {
  return `${basedir}manufacturers`
}

function generateManufacturersLogoOutputFolderName(basedir) {
  return `${basedir}manufacturers${path.sep}logo`
}

function generateManufacturersDescriptionsOutputFolderName(basedir) {
  return `${basedir}manufacturers${path.sep}description`
}

function generateManufacturersList(input) {
    log.info('Generate manufactures list')
  
    let manufacturersList = []
  
    fs.readdirSync(input).forEach(manufacturer => { 
      if (fs.lstatSync(`${input}${path.sep}${manufacturer}`).isDirectory()) {
        manufacturersList.push(manufacturer)
      }
    })
  
    log.info(`${manufacturersList.length} manufacturers found`)
  
    return manufacturersList
}

function copyManufacturersLogo(input, assetsOutput, manufacturersList) {
    const imgOutput = generateManufacturersLogoOutputFolderName(assetsOutput)

    log.info('Copy manufacturer logo')

    if (!fs.existsSync(imgOutput)) {
        fs.mkdirSync(imgOutput, { recursive: true });
    }    

    manufacturersList.forEach(manufacturer => {
        fs.copyFileSync(`${input}${path.sep}${manufacturer}${path.sep}logo.png`, `${imgOutput}${path.sep}${manufacturer}.png`)
        fs.copyFileSync(`${input}${path.sep}${manufacturer}${path.sep}logo_256x256.png`, `${imgOutput}${path.sep}${manufacturer}_256x256.png`)
    })
}

function generateManufacturerDescription(input, assetsOutput) {
  const manufacturersList = generateManufacturersList(input)
  const descOutput = generateManufacturersDescriptionsOutputFolderName(assetsOutput)
  const imgOutput = generateManufacturersLogoOutputFolderName('./assets/')

  if (!fs.existsSync(descOutput)) {
    fs.mkdirSync(descOutput, { recursive: true });
  }

  manufacturersList.forEach(manufacturer => {
    const summaryFilename = `${input}${path.sep}${manufacturer}${path.sep}summary.md`

    if (fs.existsSync(summaryFilename)) {
      let content = fs.readFileSync(summaryFilename, { encoding: 'utf8' })
      // Add logo header
      content = `![${manufacturer}](${imgOutput}/${manufacturer}.png)\n\n${content}`

      const data = HtmlConverter.makeHtml(content)
      fs.writeFileSync(`${descOutput}${path.sep}${manufacturer}.html`, data, { encoding: 'utf8' })
    }
  })
}

module.exports = {
  generateManufacturersList,
  copyManufacturersLogo,
  generateManufacturerDescription,
  generateManufacturersOutputFolderName
}
