const { addApplication } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body).payload.data
    const newRowNumber = await addApplication(data)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `POST Success - added row ${newRowNumber}`,
      }),
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (err) {
    console.error('error ocurred in processing ', event)
    console.error(err)
    return {
      statusCode: 500,
      body: err.toString(),
      headers: { 'Content-Type': 'text/plain' },
    }
  }
}
