
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const log = require('./log')

// Parse a yaml file to json file
// 
// @param input (string)      : input filename
// @return [string[], object] : [array of error, document]
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
      log.error(`Error in file ${input}`)

      return [doc.errors, doc]
    }
  
    return [[], doc]
}

// Generate file list of Yaml file
//
// @param input (string) : directory where list yaml file
// @return string[]      : array of yaml filename
function generateYamlFilesList(input) {
  log.info(`Generate list of file from ${input}`)
  let filesList = []

  fs.readdirSync(input).forEach(f => {
    if (fs.lstatSync(`${input}${path.sep}${f}`).isFile() && f.split('.').pop() === 'yaml') {
      filesList.push(f)
    }
  })

  log.info(`${filesList.length} files found`)

  return filesList
}

// Return filname without extension
// 
// @param filename (string) : the filename (e.g. 'like.jpg')
// @return string           : (e.g. 'like')
function filenameWithoutExt(filename) {
  const lastIndex = filename.lastIndexOf('.')

  return filename.slice(0, lastIndex)
}

// Read all printers.
// Add for each printer :
// - manufacturer
// - serie
// - if image found
//
// @param folder (string)       : directory name
// @param manufacturer (string) : manufacturer name
// @param serie (string)        : printer serie (default '')
// @return [boolean, object[]]  : [if error, array of json printer data]
function readAllDoc(folder, manufacturer, serie = '') {
    log.info(`Convert all files from ${folder}`)
    let printersList = []
    const yamlFilesList = generateYamlFilesList(folder)

    for (const file of yamlFilesList) {  
      let [err, doc] = parseDocument(`${folder}${path.sep}${file}`)

      if (err.length > 0) {
        if (serie) {
          log.error(`An error occured when read manufacturer ${manufacturer} on serie ${serie}`)
        } else {
          log.error(`An error occured when read manufacturer ${manufacturer}`)
        }

        return [true, []]
      }
  
      let jsonDoc = doc.toJSON()
  
      jsonDoc.printer.manufacturer = manufacturer
      jsonDoc.printer.serie = serie
      if (fs.existsSync(`${folder}${path.sep}img${path.sep}${filenameWithoutExt(file)}.jpg`)) {
        jsonDoc.printer.image = `${filenameWithoutExt(file)}.jpg`
      } else {
        jsonDoc.printer.image = null
      }
  
      printersList.push(jsonDoc)
    }
  
    log.info(`${printersList.length} read`)
  
    return [false, printersList]
}

// Save Json data into a file
//
// @param json (object)     : json data
// @param filename (string) : filename where store data
// @param prefix (string)   : prefix of data in file (default '')
// @param suffix (string)   : suffix of data in file (default '')
function saveJsonToFile(json, filename, prefix = '', suffix = '') {
  // Save printer list file
  try {
    fs.writeFileSync(filename, `${prefix}${JSON.stringify(json)}${suffix}`)
    // file written successfully
  } catch (err) {
    log.error(err)
  }
}

module.exports = { parseDocument, readAllDoc, saveJsonToFile }
