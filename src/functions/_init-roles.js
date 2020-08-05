exports.initRoles = function initRoles(event, context) {
  const promise = new Promise(function (resolve, reject) {
    const { user } = JSON.parse(event.body)
    const { roles: currentRoles } = user.app_metadata

    let body = {}
    if (!currentRoles || currentRoles.length == 0) {
      body = {
        body: JSON.stringify({ app_metadata: { roles: ['applicant'] } }),
      }
    }

    resolve({ statusCode: 200, ...body })
  })
  return promise
}
