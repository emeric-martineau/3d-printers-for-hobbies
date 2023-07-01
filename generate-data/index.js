#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const log = require('./lib/log')
const indexes = require('./lib/object-index')
const {
  parseDocument,
  saveJsonToFile
} = require('./lib/manage-document')
const {
  generatePrintersList,
  generatePagePrinterInfoIndex,
  generatePrintersOutputFolderName,
  copyPrintersImage
} = require('./lib/printers')
const {
  generateManufacturersList,
  copyManufacturersLogo,
  generateManufacturerDescription,
  generateManufacturersOutputFolderName
} = require('./lib/manufacturer')

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateIndexKeysDescription(filename, indexesValues) {
    // filters.yaml
    let [err2, doc] = parseDocument(filename)

    if (err2.length != 0) {
      return 1
    }
  
    return indexes.generateIndexKeysDescription(doc.toJSON(), indexesValues)
}

function main(input, assetsOutput) {
  const manufacturersList = generateManufacturersList(`${input}${path.sep}printers`)
  const [err, printersList] = generatePrintersList(`${input}${path.sep}printers`, manufacturersList)

  if (err) {
    return 1
  }

  const indexFolder = `${assetsOutput}/index`

  createDir(indexFolder)
  createDir(generateManufacturersOutputFolderName(assetsOutput))
  createDir(generatePrintersOutputFolderName(assetsOutput))

  // Save printer list file
  saveJsonToFile(printersList, `${generatePrintersOutputFolderName(assetsOutput)}/printers.json`)
  const idx = indexes.generateIndexesKeys(printersList[0])

  // Indexes with value
  const indexesValues = indexes.generateIndexesValues(idx, printersList)
  saveJsonToFile(indexesValues, `${indexFolder}/indexes-values.json`)

  // Keys of indexes and description
  const keysDescription = generateIndexKeysDescription(`${input}${path.sep}filters.yaml`, indexesValues)
  saveJsonToFile(keysDescription, `${indexFolder}/indexes-keys-description.json`)

  const indexWithArrayIndex = indexes.generateIndexesLink(indexesValues, printersList)
  saveJsonToFile(indexWithArrayIndex, `${indexFolder}/indexes.json`)

  saveJsonToFile(manufacturersList, `${generateManufacturersOutputFolderName(assetsOutput)}manufacturers.json`)
  copyManufacturersLogo(`${input}${path.sep}printers`, assetsOutput, manufacturersList)
  copyPrintersImage(`${input}${path.sep}printers`, assetsOutput, manufacturersList)

  generateManufacturerDescription(`${input}${path.sep}printers`, assetsOutput)

  // Generate file to display all information of printer
  const printersAttributs = generatePagePrinterInfoIndex(`${input}${path.sep}filters.yaml`, assetsOutput)
  saveJsonToFile(printersAttributs, `${generatePrintersOutputFolderName(assetsOutput)}printers-attributs.json`)  

  return 0
}

require('yargs')
  .command('$0 [input] [assetsOutput]', 'Convert 3d printers and manufacturers data to JS', (yargs) => {
    yargs
      .positional('input', {
        describe: 'input folder'
      })
      .positional('assetsOutput', {
        describe: 'output folder for picture'
      })
  }, ({ input, assetsOutput }) => {
    if (!input) {
      log.error('Missing args. Please run --help to know parameters.')
      process.exit(1)
    }

    if (!fs.existsSync(input)) {
      log.error(`Input folder '${input}' do not exists!`)
      return 1
    }
  
    if (!fs.existsSync(assetsOutput)) {
      log.error(`Output folder '${assetsOutput}' do not exists!`)
      return 1
    }

    if (input.endsWith(path.sep)) {
      input = input.substring(0, input.length-1)
    }

    if (!assetsOutput.endsWith(path.sep)) {
      assetsOutput = assetsOutput + path.sep
    }

    process.exit(main(input, assetsOutput))
  })
  .argv
