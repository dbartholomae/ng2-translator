module.exports = {
  out: "doc/",
  hideGenerator: true,
  name: require('./package.json').name,
  exclude: "**/*.+(e2e|int|spec).ts",
  mode: "file"
};