exports.handler = (event) => {
  const { user } = JSON.parse(event.body)

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ['applicant'],
      },
    }),
  }
}
