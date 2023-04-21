#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const log = require('./lib/log')
const indexes = require('./lib/object-index')
const { parseDocument, saveJsonToFile } = require('./lib/manage-document')
const generatePrintersList = require('./lib/printers')
const { generateManufacturersList, copyManufacturersLogo } = require('./lib/manufacturer')

function generateIndexKeysDescription(filename, indexesValues) {
    // filters.yaml
    let [err2, doc] = parseDocument(filename)

    if (err2.length != 0) {
      return 1
    }
  
    return indexes.generateIndexKeysDescription(doc.toJSON(), indexesValues)
}

function main(input, output, imageOutput) {
  let [err, printersList] = generatePrintersList(`${input}${path.sep}printers`)

  if (err) {
    return 1
  }

  // Save printer list file
  saveJsonToFile(printersList, `${output}${path.sep}printers.ts`, 'export const PrintersList = ')
  let idx = indexes.generateIndexesKeys(printersList[0])

  // Indexes with value
  let indexesValues = indexes.generateIndexesValues(idx, printersList)
  saveJsonToFile(indexesValues, `${output}/indexes-values.ts`, 'const obj = ', '; export const IndexesValues = new Map(Object.entries(obj));')

  // Keys of indexes and description
  let keysDescription = generateIndexKeysDescription(`${input}${path.sep}filters.yaml`, indexesValues)
  saveJsonToFile(keysDescription, `${output}/indexes-keys-description.ts`, 'const obj = ', '; export const IndexKeysDescription = new Map(Object.entries(obj));')

  let indexWithArrayIndex = indexes.generateIndexesLink(indexesValues, printersList)
  saveJsonToFile(indexWithArrayIndex, `${output}/indexes.ts`, 'const obj = ', '; export const Indexes = new Map(Object.entries(obj));')

  let manufacturersList = generateManufacturersList(`${input}${path.sep}printers`)
  saveJsonToFile(manufacturersList, `${output}/manufacturers.ts`, 'export const ManufacturersList = ')
  copyManufacturersLogo(`${input}${path.sep}printers`, imageOutput)

  // TODO generate index data type ?

  return 0
}

require('yargs')
  .command('$0 [input] [output] [imageOutput]', 'Convert 3d printer and manufacturer data to JS', (yargs) => {
    yargs
      .positional('input', {
        describe: 'input folder'
      })
      .positional('output', {
        describe: 'output folder'
      })
      .positional('imageOutput', {
        describe: 'output folder for picture'
      })
  }, ({ input, output, imageOutput }) => {
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

    if (!fs.existsSync(imageOutput)) {
      log.error(`Output folder '${imageOutput}' do not exists!`)
      return 1
    }

    if (input.endsWith(path.sep)) {
      input = input.substring(0, input.length-1)
    }

    if (!output.endsWith(path.sep)) {
      output = output + path.sep
    }

    if (!imageOutput.endsWith(path.sep)) {
      imageOutput = imageOutput + path.sep
    }

    process.exit(main(input, output, imageOutput))
  })
  .argv
