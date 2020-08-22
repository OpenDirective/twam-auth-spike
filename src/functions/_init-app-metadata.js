const { getUserData } = require('./_spreadsheet')

exports.initAppMetadata = async function initRoles(event, context) {
  console.log('iam')

  const { user } = JSON.parse(event.body)
  const { roles: currentRoles, currentCountry } = user.app_metadata
  let body = {}

  // TODO parse data entered in spreadsheet
  const userData = await getUserData(user.email)
  if (user.email.includes('@twam.uk') && userData.email) {
    const { roles, country } = userData
    console.log(
      JSON.stringify(roles),
      JSON.stringify(currentRoles),
      country,
      currentCountry,
    )
    if (
      JSON.stringify(roles) != JSON.stringify(currentRoles) ||
      country != currentCountry
    ) {
      body = {
        body: JSON.stringify({ app_metadata: { roles, country } }),
      }
    }
  } else if (!currentRoles || currentRoles.length == 0) {
    console.log(`${user.email} setting applicant`)
    body = {
      body: JSON.stringify({ app_metadata: { roles: ['applicant'] } }),
    }
  }

  console.log(`${user.email} ${JSON.stringify(body)}`)

  return { statusCode: 200, ...body }
}
