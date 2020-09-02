const { addApplication } = require('./_spreadsheet')
const { sendNotification } = require('./_notifications')

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body).payload.data
    console.log(data)
    const rowObj = await addApplication(data)
    await sendNotification('application', rowObj)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `POST Success - added row ${rowObj.row}`,
      }),
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (err) {
    console.error('error ocurred in processing ', event)
    console.error(err)
    return {
      statusCode: 500,
      body: err.toString(),
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
    }
  }
}
