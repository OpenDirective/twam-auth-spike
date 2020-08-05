exports.handler = async (event, context) => {
  return require('./_init-roles').initRoles(event, context)
}
