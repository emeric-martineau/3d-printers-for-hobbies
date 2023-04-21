const fs = require('fs')
const path = require('path')
const log = require('./log')

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

    if (!fs.existsSync(imgOutput)){
        fs.mkdirSync(imgOutput, { recursive: true });
    }    

    manufacturersList.forEach(manufacturer => {
        fs.copyFileSync(`${input}/${manufacturer}/logo.png`, `${imgOutput}/${manufacturer}.png`)
        fs.copyFileSync(`${input}/${manufacturer}/logo_256x256.png`, `${imgOutput}/${manufacturer}_256x256.png`)
    })
}

module.exports = { generateManufacturersList, copyManufacturersLogo }
