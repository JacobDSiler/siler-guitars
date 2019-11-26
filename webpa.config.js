const path = require("path");

module.exports = {
  entry: "./app.js",
  output: {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app")
  },
  mode: "development",
  watch: true,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["css-loader"]
      }
    ]
  }
};
