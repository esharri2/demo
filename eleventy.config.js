export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("**/*.css");
	eleventyConfig.addWatchTarget("**/*.css");
};
