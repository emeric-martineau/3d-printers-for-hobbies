/*
if (
    typeof yourVariable === 'object' &&
    !Array.isArray(yourVariable) &&
    yourVariable !== null
) {
    executeSomeCode();
}

Object.keys(object1)
*/

function isObject(v) {
  return typeof v === 'object' &&
        !Array.isArray(v) &&
        v !== null
}

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

function listAllKeysValues(keysToCheck) {
  let keysList = []
  for (let i = 0; i < keysToCheck.length; i++) {
    let [key, value] = keysToCheck[i] 

    keysList.push(key)

    if (isObject(value)) {
      keysToCheck = keysToCheck.concat(
        keysValues(value, key))
    }
  }

  return keysList
}

module.exports = {
  generateIndexes: obj => {
    return listAllKeysValues(keysValues(obj))
  }
}
