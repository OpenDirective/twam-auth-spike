// ensure user with no role becomes role = applicant
exports.handler = async (event) => {
  return require('./init-roles').initRoles(event)
}
