//const { getUserData } = require('./_spreadsheet')

exports.initAppMetadata = async function initRoles(event, context) {
  console.log('iam')

  const { user } = JSON.parse(event.body)
  const { roles: currentRoles, country } = user.app_metadata
  let body = {}

  //TODO only call for twam.uk mail
  /*const userData = await getUserData(user.email)
  if (userData.email) {
    const { roles, country } = userData
    body = {
      body: JSON.stringify({ app_metadata: { roles, country } }),
    }
    console.log(userData, body)
  } else */ {
    if (!currentRoles || currentRoles.length == 0) {
      body = {
        body: JSON.stringify({ app_metadata: { roles: ['applicant'] } }),
      }
    }
  }

  console.log(body)

  return { statusCode: 200, ...body }
}
