import { HtmlBasePlugin } from "@11ty/eleventy";


export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/*.js");
  eleventyConfig.addPassthroughCopy("**/assets/*");
  eleventyConfig.addWatchTarget("**/*.css");
  eleventyConfig.addWatchTarget("**/*.js");
  eleventyConfig.addPlugin(HtmlBasePlugin);
  return eleventyConfig
}
