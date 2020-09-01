const { getAssignmentforEmail } = require('./_spreadsheet')

exports.initAppMetadata = async function initRoles(event, context) {
  console.log('iam')

  const { user } = JSON.parse(event.body)
  const { roles: currentRoles, country: currentCountry } = user.app_metadata
  let body = {}

  // TODO parse data entered in spreadsheet
  const assignment = await getAssignmentforEmail(user.email)
  if (user.email.includes('@twam.uk') && assignment.email) {
    const { role, country } = assignment
    if (
      JSON.stringify(roles) != JSON.stringify(currentRoles) ||
      country != currentCountry
    ) {
      body = {
        body: JSON.stringify({ app_metadata: { roles: ['applicant'] } }),
        headers: { 'Content-Type': 'application/json' },
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
