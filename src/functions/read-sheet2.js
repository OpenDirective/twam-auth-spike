const { getUserApplications, getCountyApplications } = require('./_spreadsheet')

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

  console.log(event, context)

  try {
    const rows = await (type == 'country'
      ? getCountyApplications(country)
      : type == 'user'
      ? getUserApplications(email)
      : new Promise((resolve) => {
          resolve([])
        }))
    console.log(rows)
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
