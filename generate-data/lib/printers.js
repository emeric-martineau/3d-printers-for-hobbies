const fs = require('fs')
const path = require('path')
const log = require('./log')
const { readAllDoc, parseDocument } = require('./manage-document')

// Generate list of series of a printer
//
// @param input (string) : path of printer
// @return string[]
function generateSeriesPrintersList(input) {
    log.info(`Generate printer's serie list form ${input}`)
    let seriesList = []
  
    fs.readdirSync(input).forEach(serie => {
      if (fs.lstatSync(input + path.sep + serie).isDirectory() && serie !== 'img') {
        seriesList.push(serie)
      }
    })
  
    log.info(`${seriesList.length} series found`)
  
    return seriesList
}

// Generate list of printers of a manufacturer
// Return array with first item is if an error occur, second item is data
//
// @param input (string) : root path of all manufacturers
// @param manufacturersList (string[]) : list of manufacturer
// @return [boolean, string[]]
function generatePrintersList(input, manufacturersList) { 
    log.info(`Generate global printers list form ${input}`)
    let listOfPrinterToReturn = []
  
    for (const manufacturer of manufacturersList) {
      let currentPath = `${input}${path.sep}${manufacturer}`

      let printerList = generateSeriesPrintersList(currentPath)
  
      if (printerList.length == 0) {

        let [err, docs] = readAllDoc(currentPath, manufacturer)

        if (err) {
          log.error(`Error occured to generate printer list from folder ${currentPath} without any serie`)

          return [true, []]
        }
  
        listOfPrinterToReturn = listOfPrinterToReturn.concat(docs)
      } else {
        for (const serie of printerList) {
          let currentSeriePath = `${currentPath}${path.sep}${serie}`
    
          let [err, docs] = readAllDoc(currentSeriePath, manufacturer, serie)
    
          if (err) {
            log.error(`Error occured to generate printer list from folder ${currentPath}`)

            return [true, []]
          }
    
          listOfPrinterToReturn = listOfPrinterToReturn.concat(docs)
        }
      }
    }
  
    log.info(`Global printers list as ${listOfPrinterToReturn.length} elements`)

    return [false, listOfPrinterToReturn]
}

// Read YAML data of file that describe all keys in YAML file of printer
// Return array with first item is if an error occur, second item is data
//
// @param filename (string) : filename of printer
// @return [boolean, object]
function generatePagePrinterInfoIndex(filename) {
    // filters.yaml
    let [err2, doc] = parseDocument(filename)

    if (err2.length != 0) {
      return [true, err2]
    }

    return [false, doc.toJSON()]
}

// Generate the name of printers input directory
//
// @param basedir (string) : basedir of folder
// @return string
function generatePrintersOutputFolderName(basedir) {
  return `${basedir}printers${path.sep}`
}

// Generate the name of printers images output directory
//
// @param basedir (string) : basedir of folder
// @return string
function generatePrintersImageOutputFolderName(basedir) {
  return `${generatePrintersOutputFolderName(basedir)}images${path.sep}`
}

// Copy all images from a directory
//
// @param imagePath (string) : folder where images are stored
// @param imgOutput (string) : folder where we copy images
function copySubPrintersImage(imagePath, imgOutput) {
  if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isDirectory()) {
    fs.readdirSync(imagePath).forEach(imageFilename => {
      if (fs.lstatSync(`${imagePath}${path.sep}${imageFilename}`).isFile()) {
        log.info(`Copy ${imagePath}${path.sep}${imageFilename} to ${imgOutput}${imageFilename}`)
        fs.copyFileSync(`${imagePath}${path.sep}${imageFilename}`, `${imgOutput}${imageFilename}`)
      }
    })
  }
}

// Copy all images of printers in asset folder
//
// @param input (string) : printers input root folder
// @param assetsOutput (string) : asset folder where copy file
// @param manufacturersList (string[]) : list of manufacturer
// @return string
function copyPrintersImage(input, assetsOutput, manufacturersList) {
  const imgOutput = generatePrintersImageOutputFolderName(assetsOutput)

  log.info('Copy printers images')

  if (!fs.existsSync(imgOutput)) {
      fs.mkdirSync(imgOutput, { recursive: true });
  }    

  manufacturersList.forEach(manufacturer => {
    let currentPath = `${input}${path.sep}${manufacturer}`
    let printerList = generateSeriesPrintersList(currentPath)

    if (printerList.length == 0) {
      copySubPrintersImage(`${currentPath}${path.sep}img`, imgOutput)
    } else {
      printerList.forEach(serie => {
        copySubPrintersImage(`${currentPath}${path.sep}${serie}${path.sep}img`, imgOutput)
      })
    }
  })
}

module.exports = {
  generatePrintersList,
  generatePagePrinterInfoIndex,
  generatePrintersOutputFolderName,
  copyPrintersImage
}
