const querystring = require('querystring')
const { updateApplication } = require('./_spreadsheet')
const { sendNotification } = require('./_notifications')

exports.handler = async (event, context) => {
  const params = querystring.parse(event.body)

  try {
    const { row, ...columns } = params
    const rowN = parseInt(row, 10)
    const rowObj = await updateApplication(rowN, columns)
    await sendNotification('evaluation', rowObj)
    return {
      statusCode: 200,
      body: JSON.stringify(columns), // assume they added OK
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (err) {
    console.error('error ocurred in processing', err, event)
    return {
      statusCode: 500,
      body: err.toString(),
      headers: { 'Content-Type': '; charset=UTF-8' },
    }
  }
}
