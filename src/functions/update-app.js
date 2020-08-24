const querystring = require('querystring')
const { updateApplication } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  const params = querystring.parse(event.body)

  try {
    const { row, ...columns } = params
    const rowN = parseInt(row, 10)
    const newColumns = await updateApplication(rowN, columns)
    return {
      statusCode: 200,
      body: JSON.stringify(newColumns),
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (err) {
    console.error('error ocurred in processing', err, event)
    return {
      statusCode: 500,
      body: err.toString(),
      headers: { 'Content-Type': 'text/plain' },
    }
  }
}
