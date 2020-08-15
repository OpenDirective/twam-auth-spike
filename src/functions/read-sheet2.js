if (!process.env.NETLIFY) {
  // use .enc file for local dev and assume netlify variables in CI
  // TODO can this not be run time?
  require('dotenv').config()
}

const { getUserApplications } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  const {
    user: { email },
  } = context.clientContext

  try {
    const apps = await getUserApplications(email)
    const result = JSON.stringify({ apps })
    return {
      statusCode: 200,
      body: result,
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
