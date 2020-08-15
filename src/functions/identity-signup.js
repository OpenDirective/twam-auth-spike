const { initAppMetadata } = require('./_init-app-metadata')

exports.handler = async (event, context) => {
  return await initAppMetadata(event, context)
}
