import { HtmlBasePlugin } from "@11ty/eleventy";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("**/*.css");
	eleventyConfig.addWatchTarget("**/*.css");
	eleventyConfig.addPlugin(HtmlBasePlugin, {baseHref: eleventyConfig.pathPrefix,});
};


