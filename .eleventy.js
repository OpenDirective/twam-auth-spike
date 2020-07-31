module.exports = (config) => {
  config.addPassthroughCopy("src/css");
  config.addPassthroughCopy("src/images");
  config.addPassthroughCopy("src/js");
  config.addPassthroughCopy({ "src/favicons/": "/" });

  return {
    dir: {
      input: "src",
    },
  };
};
