const { addApplication } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body).payload.data
    console.log(data)

    const newRowNumber = await addApplication(data)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `POST Success - added row ${newRowNumber}`,
      }),
    }
  } catch (err) {
    console.error('error ocurred in processing ', event)
    console.error(err)
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
}
