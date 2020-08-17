const {
  getUserApplications,
  getCountryApplications,
} = require('./_spreadsheet')

exports.handler = async (event, context) => {
  const {
    user: { email },
    user: {
      app_metadata: { country },
    },
  } = context.clientContext
  const {
    queryStringParameters: { type },
  } = event

  try {
    const rows = await (type == 'country'
      ? getCountryApplications(country)
      : type == 'user'
      ? getUserApplications(email)
      : new Promise((resolve) => {
          resolve([])
        }))
    const result = JSON.stringify({ rows })
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
