import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/*.js");
  eleventyConfig.addPassthroughCopy("**/assets/*");


  eleventyConfig.addWatchTarget("**/*.css");
  eleventyConfig.addWatchTarget("**/*.js");

  eleventyConfig.addPlugin(HtmlBasePlugin, {
    // The base URL: defaults to Path Prefix
    baseHref: eleventyConfig.pathPrefix || "/demo",

    // But you could use a full URL here too:
    // baseHref: "http://example.com/"

    // Comma separated list of output file extensions to apply
    // our transform to. Use `false` to opt-out of the transform.
    extensions: "html",
  });
}
