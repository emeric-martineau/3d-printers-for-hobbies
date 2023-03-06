// Return true if is Javascript object
function isObject(v) {
  return typeof v === 'object' &&
        !Array.isArray(v) &&
        v !== null
}

// Return true if is Javascript array
function isArray(v) {
  return v !== null && Array.isArray(v)
}


// For one object, generate an array with key and value
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

// Read value
function pseudoJsonPath(obj, path) {
  path.split('.').forEach(key => {
    obj = obj[key]
  })

  return obj
}

// Add value in index if not null and flat array
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

// Generate indexes of each index.
// return a map with key associate to array of distinct value
function createIndexes(indexes, objectList) {
  let idx = {}

  indexes.forEach(key => {
    idx[key] = []

    objectList.forEach(item => idx[key] = addInIndex(idx[key], pseudoJsonPath(item, key)))
    
  })

  return idx
}

module.exports = {
  // Generate list of keys indexes
  generateIndexesKeys: obj => {
    return listAllKeysValues(keysValues(obj))
  },
  // Generate indexes of each index.
  // return a map with key associate to array of distinct value
  generateIndexes: (indexes, objectList) => {
    return createIndexes(indexes, objectList)
  }
}
