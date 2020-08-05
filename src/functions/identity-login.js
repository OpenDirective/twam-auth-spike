// ensure user with no role becomes role = applicant
exports.handler = async (event, context) => {
  return require('./_init-roles').initRoles(event, context)
}
