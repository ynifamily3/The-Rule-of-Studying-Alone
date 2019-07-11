const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000
        }
      }
    });

    return config;
  }
});
/*
react semantic ui 문제로 https://github.com/zeit/next.js/issues/3825 참고하여 해결함.
그런데 메모리 누수가 발생함.. => CDN 불러오는 걸로 일단 해결(?) 했음
*/
