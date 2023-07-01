const fs = require('fs')
const path = require('path')
const log = require('./log')
const { readAllDoc, parseDocument } = require('./manage-document')

function generateSeriesPrintersList(input) {
    log.info(`Generate printer's serie list form ${input}`)
    let seriesList = []
  
    fs.readdirSync(input).forEach(serie => {
      if (fs.lstatSync(input + path.sep + serie).isDirectory()) {
        seriesList.push(serie)
      }
    })
  
    log.info(`${seriesList.length} series found`)
  
    return seriesList
}
  
// function generateFilesList(input) {
//     log.info(`Generate list of file from ${input}`)
//     let filesList = []
  
//     fs.readdirSync(input).forEach(f => {
//       if (fs.lstatSync(input + path.sep + f).isFile() && f.split('.').pop() === 'yaml') {
//         filesList.push(f)
//       }
//     })
  
//     log.info(`${filesList.length} files found`)
  
//     return filesList
// }

function generateSeriesPrintersList(input) {
    log.info(`Generate printer's serie list form ${input}`)
    let seriesList = []
  
    fs.readdirSync(input).forEach(serie => {
      if (fs.lstatSync(input + path.sep + serie).isDirectory()) {
        seriesList.push(serie)
      }
    })
  
    log.info(`${seriesList.length} series found`)
  
    return seriesList
}

function generatePrintersList(input, manufacturersList) { 
    log.info(`Generate global printers list form ${input}`)
    let printersList = []
  
    manufacturersList.forEach(manufacturer => {
      let currentPath = input + path.sep + manufacturer
  
      generateSeriesPrintersList(currentPath).forEach(serie => {
        let currentSeriePath = currentPath + path.sep + serie
  
        let [err, docs] = readAllDoc(currentSeriePath, manufacturer, serie)
  
        if (err) {
          return [true, []]
        }
  
        printersList = printersList.concat(docs)
  
      })
  
      let [err, docs] = readAllDoc(currentPath, manufacturer)
  
      if (err) {
        return [true, []]
      }
  
      printersList = printersList.concat(docs)
    })
  
    log.info(`Global printers list as ${printersList.length} elements`)
  
    return [false, printersList]
}

function generatePagePrinterInfoIndex(filename) {
    // filters.yaml
    let [err2, doc] = parseDocument(filename)

    if (err2.length != 0) {
      return 1
    }

    return doc.toJSON()
}

function generatePrintersOutputFolderName(basedir) {
  return `${basedir}printers${path.sep}`
}

function generatePrintersImageOutputFolderName(basedir) {
  return `${generatePrintersOutputFolderName(basedir)}images${path.sep}`
}

function copyPrintersImage(input, assetsOutput, manufacturersList) {
  const imgOutput = generatePrintersImageOutputFolderName(assetsOutput)

  log.info('Copy printers images')

  if (!fs.existsSync(imgOutput)) {
      fs.mkdirSync(imgOutput, { recursive: true });
  }    

  manufacturersList.forEach(manufacturer => {
    let currentPath = `${input}${path.sep}${manufacturer}`

    generateSeriesPrintersList(currentPath).forEach(serie => {
      let imagePath = `${currentPath}${path.sep}${serie}${path.sep}img`

      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isDirectory()) {
        fs.readdirSync(imagePath).forEach(imageFilename => {
          if (fs.lstatSync(`${imagePath}${path.sep}${imageFilename}`).isFile()) {
            log.info(`Copy ${imagePath}${path.sep}${imageFilename} to ${imgOutput}${path.sep}${imageFilename}`)
            fs.copyFileSync(`${imagePath}${path.sep}${imageFilename}`, `${imgOutput}${path.sep}${imageFilename}`)
          }
        })
      }
    })
  })
}

module.exports = {
  generatePrintersList,
  generatePagePrinterInfoIndex,
  generatePrintersOutputFolderName,
  copyPrintersImage
}
