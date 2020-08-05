exports.handler = (event, context, callback) => {
  console.log('e', event, 'c', context, 'cb', callback)

  return {
    statusCode: 200,
  }

  /*
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
  }*/
}
