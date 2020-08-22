//const { updateRow } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  console.log(event.body)
  const data = JSON.parse(event.body)
  console.log(data)
}
