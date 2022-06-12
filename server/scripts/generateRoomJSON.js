// This script originally mashed together ALL JSOn files in server/src/rooms/data.
// Now, we just dump in a single generated JSON file.
// This can probably be safely deleted, but leaving in the codebase for now
// (Em, June 11 2022)

const fs = require('fs')
const recursive = require('recursive-readdir')
const { isArray } = require('lodash')

function staticRoomData () {
  return new Promise((resolve, reject) => {
    recursive('./src/rooms/data', ['*.ts', '*.tsx', '*.js', 'compiled.json']).then(async (files) => {
      console.log(files)

      const data = await Promise.all(files.map((f) => {
        return fs.promises.readFile(f, 'utf8')
      }))

      const result = {}
      data.forEach((room) => {
        const json = JSON.parse(room)

        const addToObject = (r) => {
          result[r.id] = r
        }

        if (isArray(json)) {
          json.forEach(addToObject)
        } else {
          addToObject(json)
        }
      })
      resolve(result)
    })
  })
}

staticRoomData().then(data => {
  fs.promises.writeFile('./src/rooms/compiled.json', JSON.stringify(data), 'utf8')
})
