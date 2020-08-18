const { getFilteredApplications } = require('./_spreadsheet')

async function getUserApplications(email) {
  try {
    const rows = await getFilteredApplications('B', 'F', 'B', email) // Need B as is removed
    return rows
  } catch (err) {
    throw err
  }
}

async function getCountryApplications(country) {
  try {
    const rows = await getFilteredApplications('A', 'G', 'C', country)
    return rows
  } catch (err) {
    throw err
  }
}

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
