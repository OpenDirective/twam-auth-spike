console.info(process.cwd())

const { initAppMetadata } = require('./_init-app-metadata')

exports.handler = async (event, context) => {
  console.info(process.cwd())
  return initAppMetadata(event, context)
}
