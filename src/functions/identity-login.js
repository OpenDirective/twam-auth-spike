exports.handler = (event) => {
  const { user } = JSON.parse(event.body)
  const { roles } = user.app_metadata

  console.log('r', roles)

  return {
    statusCode: 200,
    body:
      roles === undefined || roles.length == 0
        ? JSON.stringify({
            app_metadata: {
              roles: ['applicant'],
            },
          })
        : '',
  }
}
