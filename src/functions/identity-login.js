const { initAppMetadata } = require('./_init-app-metadata')

console.info('login')
return

exports.handler = async (event, context) => {
  return initAppMetadata(event, context)
}
