exports.passthroughCopy = function (config) {
  config.addPassthroughCopy('src/css')
  config.addPassthroughCopy('src/images')
  config.addPassthroughCopy('src/js')
  config.addPassthroughCopy({ 'src/favicons/': '/' })

  if (process.env.npm_lifecycle_event != 'dev') {
    config.addPassthroughCopy({ 'src/sitefiles/': '/' }) // stop netlify _redirect when locally developing
  }
}
