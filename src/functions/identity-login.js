// ensure user with no role becomes role = applicant
exports.handler = async (event) => {
  const promise = new Promise(function (resolve, reject) {
    const { user } = JSON.parse(event.body)
    const { roles: currentRoles } = user.app_metadata
    const roles =
      currentRoles === undefined || currentRoles.length == 0
        ? ['applicant']
        : undefined
    const bodyString = roles
      ? JSON.stringify({
          app_metadata: {
            roles,
          },
        })
      : undefined

    const response = {
      statusCode: 200,
      ...(bodyString ? { body: bodyString } : {}),
    }

    resolve(response)
  })
  return promise
}
