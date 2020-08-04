module.exports = (config) => {
  config.addPassthroughCopy('src/css')
  config.addPassthroughCopy('src/images')
  config.addPassthroughCopy('src/js')
  config.addPassthroughCopy({ 'src/favicons/': '/' })
  config.addPassthroughCopy({ 'src/sitefiles/': '/' })

  return {
    dir: {
      input: 'src',
    },
  }
}
