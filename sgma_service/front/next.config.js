require("dotenv").config(); // enbale dotenv
const path = require("path"); // using current path
const dotenvWebpack = require("dotenv-webpack"); // using dotenv with webpack
const withCSS = require("@zeit/next-css");
const withProgressBar = require("next-progressbar");
const WebpackBar = require("webpackbar");

module.exports = withCSS(
  withProgressBar({
    progressBar: {
      profile: true
    },
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000,
            publicPath: '/_next/static/',
            outputPath: 'static/',
            name: '[name].[ext]',
          }
        }
      });
      config.plugins = config.plugins || [];
      config.plugins = [
        ...config.plugins,
        new dotenvWebpack({
          path: path.join(__dirname, ".env"),
          systemvars: true
        })
      ];
      // plugins.push(new WebpackBar()); // 문제 생길 시 이 부분을 주석 처리하여도 무방하다.
      return config;
    }
  })
);
/*
react semantic ui 문제로 https://github.com/zeit/next.js/issues/3825 참고하여 해결함.
그런데 메모리 누수가 발생함.. => CDN 불러오는 걸로 일단 해결(?) 했음
*/
