#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const log = require('./log')
const indexes = require('./object-index')

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

function generatePrintersList(input) { 
  log.info(`Generate global printers list form ${input}`)
  let printersList = []

  generateManufacturersList(input).forEach(manufacturer => {
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

function generateIndexKeysDescription(filename, indexesValues) {
    // filters.yaml
    let [err2, doc] = parseDocument(filename)

    if (err2.length != 0) {
      return 1
    }
  
    return indexes.generateIndexKeysDescription(doc.toJSON(), indexesValues)
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

function main(input, output) {
  let [err, printersList] = generatePrintersList(`${input}${path.sep}printers`)

  if (err) {
    return 1
  }

  // Save printer list file
  saveJsonToFile(printersList, `${output}${path.sep}printers.ts`, 'export const PrintersList = ')
  let idx = indexes.generateIndexesKeys(printersList[0])

  let indexesValues = indexes.generateIndexesValues(idx, printersList)
  saveJsonToFile(indexesValues, `${output}/indexes-values.json`)

  let keysDescription = generateIndexKeysDescription(`${input}${path.sep}filters.yaml`, indexesValues)
  saveJsonToFile(keysDescription, `${output}/indexes-keys-description.ts`, 'export const IndexKeysDescription = new Map<string, string>(', ')')

  // let indexWithArrayIndex = indexes.generateIndexesLink(indexesValues, printersList)
  // saveJsonToFile(indexWithArrayIndex, `${output}/indexes.json`)

  // TODO generate index data type ?

  return 0
}

require('yargs')
  .command('$0 [input] [output]', 'Convert 3d printer and manufacturer data to JS', (yargs) => {
    yargs
      .positional('input', {
        describe: 'input folder'
      })
      .positional('output', {
        describe: 'output folder'
      })
  }, ({ input, output }) => {
    if (!input || !output) {
      log.error('Missing args. Please run --help to know parameters.')
      process.exit(1)
    }

    if (!fs.existsSync(input)) {
      log.error(`Input folder '${input}' do not exists!`)
      return 1
    }
  
    if (!fs.existsSync(output)) {
      log.error(`Output folder '${output}' do not exists!`)
      return 1
    }

    if (input.endsWith(path.sep)) {
      input = input.substring(0, input.length-1)
    }

    if (!output.endsWith(path.sep)) {
      output = output + path.sep
    }

    process.exit(main(input, output))
  })
  .argv
