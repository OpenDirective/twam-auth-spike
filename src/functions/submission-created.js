// ensure user with no role becomes role = applicant
exports.handler = async (event, context) => {
  const { name, email, message } = event.payload.data
  console.log(name, email, message)
}
