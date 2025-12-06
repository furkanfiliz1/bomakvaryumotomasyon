const fs = require('fs')
const path = require('path')

const iconTypePath = path.resolve(
  __dirname,
  './src/components/common/Icon/types.ts',
)

const icomoonJson = require('./selection.json')
const iconNames = icomoonJson.icons.map((item) => item.properties.name)

const temp = `
export const IconTypes = {
  ${iconNames.map((item) => `'${item}':'${item}'`)}
}
`
fs.writeFile(iconTypePath, temp, (err) => {
  if (err) {
    console.log('error: ', err)
  }
})
