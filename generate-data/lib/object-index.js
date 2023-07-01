// Return true if is Javascript object
//
// @param v (string) : object or other
// @return boolean
function isObject(v) {
  return typeof v === 'object' &&
        !Array.isArray(v) &&
        v !== null
}

// Return true if is Javascript array
//
// @param v (string) : object or other
// @return boolean
function isArray(v) {
  return v !== null && Array.isArray(v)
}


// For one object, generate an array with key and value
//
// @param obj (object) : object
// @param prefix (string - default value '') : prefix to add before key
// @return string[]
function keysValues(obj, prefix = '') {
  let keysList = []

  Object.entries(obj).forEach(([key, value], _) => {
    if (prefix) {
      keysList.push([`${prefix}.${key}`, value])
    } else {
      keysList.push([`${key}`, value])
    }
  })

  return keysList
}

// List keys/values for object and sub-object
//
// @param keysToCheck (string[]) : list of key
// @return string[]
function listAllKeysValues(keysToCheck) {
  let keysList = []

  for (let i = 0; i < keysToCheck.length; i++) {
    let [key, value] = keysToCheck[i] 

    if (isObject(value)) {
      keysToCheck = keysToCheck.concat(
        keysValues(value, key))
    } else {
      // Add only if key contains direct value
      keysList.push(key)
    }
  }

  return keysList
}

// Read value in object with path like 'key1.key2.key3'
//
// @param obj (object) : object to read
// @param path (string) : path to read
// @return object
function pseudoJsonPath(obj, path) {
  path.split('.').forEach(key => {
    if (isObject(obj)) {
      obj = obj[key]
    }
  })

  return obj
}

// Add value in index if value is not already in array
// If value is null, nothing do
// If value is a array, all items are insered (if not already in)
//
// @param index (string[]) : index to add value
// @param value (string) : this value
// @return string[]
function addInIndex(index, value) {
  if (isArray(value)) {
    value.forEach(item => {
      if (index.includes(item) === false) {
        index.push(item)       
      }
    })
  } else if (value !== null) {
    if (index.includes(value) === false) {
      index.push(value)       
    }
  }

  return index
}

// Generate indexes of each index
// Return a map with key associate to array of distinct value
//
// @param indexes (string[]) : index contains list of read key
// @param objectList (object[]) : list of object where read key
// @return object
function createIndexes(indexes, objectList) {
  let idx = {}

  indexes.forEach(key => {
    idx[key] = []

    objectList.forEach(item => idx[key] = addInIndex(idx[key], pseudoJsonPath(item, key)))
    
  })

  return idx
}

// Generate link between index value and array position of data
// in objectList
//
// @param indexesValues (object) : data
// @param objectList (object[]) : list of object
// @return object
function createIndexList(indexesValues, objectList) {
  let newIndex = {}

  // Init newIndex
  Object.entries(indexesValues).forEach(([key, values], _) => 
    values.forEach(v => newIndex[`${key}-${v}`] = [])
  )

  // For each keys
  Object.entries(indexesValues).forEach(([key, values], _) => {
    // We get array with values

    // For each values, we search who have this value in this keys
    values.forEach(currentValue => {
      // Now for each object in list
      objectList.forEach((currentObject, currentObjectIndex) => {
        let valueOfProperty = pseudoJsonPath(currentObject, key)

        // If value is array
        if (
          (isArray(valueOfProperty) && valueOfProperty.includes(currentValue)) ||
          (valueOfProperty === currentValue)) {
          newIndex[`${key}-${currentValue}`].push(currentObjectIndex)
        }
      })
    })
  })

  return newIndex
}

module.exports = {
  // Generate list of keys indexes
  generateIndexesKeys: obj => {
    return listAllKeysValues(keysValues(obj))
  },
  // Generate indexes of each index.
  // return a map with key associate to array of distinct value
  generateIndexesValues: createIndexes,
  // Generate link between index value and array position of data
  // in objectList
  generateIndexesLink: (indexesValues, objectList) => {
    return createIndexList(indexesValues, objectList)
  },
  // Generate index description.
  generateIndexKeysDescription: (indexDescription, indexesValues) => {
    let keysDescription = {}

    Object.keys(indexesValues).forEach(key => {
      v = pseudoJsonPath(indexDescription, key)

      //if (!(v === undefined || v === null)) {
      if (v !== undefined && v !== null && v['filter']) {
        keysDescription[key] = v['text']
      }
    })

    return keysDescription
  }
}
