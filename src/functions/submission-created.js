if (!process.env.NETLIFY) {
  // use .enc file for local dev and assume netlify variables in CI
  // TODO can this not be run time?
  require('dotenv').config()
}

const { addApplication } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body).payload.data
    const addedRow = await addApplication(data)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `POST Success - added row ${addedRow._rowNumber - 1}`,
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
