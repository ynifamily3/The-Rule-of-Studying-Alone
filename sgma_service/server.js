// server.js
const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 80;

const dbConnect = require("./back/models");
const passportConfig = require("./back/passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const ExpressApp = express();
const NextApp = next({
  dev,
  quiet: dev,
  dir: "./front",
  conf: {
    // next.config.js 에서 사용하는 객체 값
    webpack: {}
  }
});
const NextHandler = NextApp.getRequestHandler();

// const CustomRouter = require("./routes");
const NextRouter = express.Router();

// front server (next router 에서 sgma_service/front/static 에 있는 내용을 자동으로)
// domain/static/... 에 매핑한다.

// robots.txt는 예외적으로 루트에 매핑한다.
console.log(__dirname);
NextRouter.use(
  "/robots.txt",
  express.static(`${__dirname}/front/static/robots.txt`)
);

NextRouter.use("/api", require("./back/routes"));
NextRouter.get("*", (req, res) => NextHandler(req, res));

NextApp.prepare().then(() => {
  /*ExpressApp.use( SOME MIDDLEWARE 1 );
  ExpressApp.use( SOME MIDDLEWARE 2 );*/
  // ExpressApp.use("/api", CustomRouter);
  dbConnect();
  ExpressApp.use(bodyParser.json());
  ExpressApp.use(bodyParser.urlencoded({ extended: true }));
  ExpressApp.use(cookieParser());
  passportConfig(ExpressApp, passport);

  ExpressApp.use("/", NextRouter);

  ExpressApp.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening on ::${PORT}`);
  });
});
