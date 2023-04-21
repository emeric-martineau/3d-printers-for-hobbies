
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const log = require('./log')

// Parse a yaml file to json file
function parseDocument(input) {
    const inputStr = fs.readFileSync(input === '-' ? 0 : input, 'utf8')
    const options = { keepNodeTypes: true }
    const doc = YAML.parseDocument(inputStr, options)
  
    for (const warn of doc.warnings) {
      log.warning(`${warn.name}: ${warn.message}`)
    }
    
    for (const error of doc.errors) {
      log.error(`${error.name}: ${error.message}`)
    }
  
    if (doc.errors.length > 0) {
      return [doc.errors, doc]
    }
  
    return [[], doc]
}


function generateFilesList(input) {
  log.info(`Generate list of file from ${input}`)
  let filesList = []

  fs.readdirSync(input).forEach(f => {
    if (fs.lstatSync(input + path.sep + f).isFile() && f.split('.').pop() === 'yaml') {
      filesList.push(f)
    }
  })

  log.info(`${filesList.length} files found`)

  return filesList
}

function readAllDoc(folder, manufacturer, serie = '') {
    log.info(`Convert all files from ${folder}`)
    let printersList = []
  
    generateFilesList(folder).forEach(file => {
      let [err, doc] = parseDocument(folder + path.sep + file)
  
      if (err.length > 0) {
        return [true, []]
      }
  
      let jsonDoc = doc.toJSON()
  
      jsonDoc.printer.manufacturer = manufacturer
      jsonDoc.printer.serie = serie
  
      //console.log(JSON.stringify(jsonDoc))
      printersList.push(jsonDoc)
    })
  
    log.info(`${printersList.length} read`)
  
    return [false, printersList]
}

function saveJsonToFile(json, filename, prefix = '', suffix = '') {
  // Save printer list file
  try {
    fs.writeFileSync(filename, prefix + JSON.stringify(json) + suffix)
    // file written successfully
  } catch (err) {
    log.error(err)
  }
}

module.exports = { parseDocument, readAllDoc, saveJsonToFile }
