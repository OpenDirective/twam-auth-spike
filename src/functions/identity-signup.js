const { initAppMetadata } = require('./_init-app-metadata')

exports.handler = async (event, context) => {
  return initAppMetadata(event, context)
}
