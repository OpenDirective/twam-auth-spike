exports.passthroughCopy = function (config) {
  config.addPassthroughCopy('src/css')
  config.addPassthroughCopy('src/images')
  config.addPassthroughCopy('src/js')
  config.addPassthroughCopy({ 'src/favicons/': '/' })
  config.addPassthroughCopy({ 'src/sitefiles/': '/' })
  config.addPassthroughCopy({ 'src/functions/': '/functions/' })
}
