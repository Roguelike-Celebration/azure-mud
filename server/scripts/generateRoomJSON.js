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
