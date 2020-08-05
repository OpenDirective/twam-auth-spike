module.exports = (config) => {
  require('./src/_11ty/passthrough').passthroughCopy(config)

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    dir: {
      input: 'src',
    },
  }
}
