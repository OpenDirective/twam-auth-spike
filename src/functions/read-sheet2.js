const { getUserApplications } = require('./_spreadsheet')

exports.handler = async (event, context) => {
  const {
    user: { email },
    user: {
      app_metadata: { country },
    },
  } = context.clientContext
  console.log(email, country)

  try {
    const rows = await getUserApplications(email)
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
