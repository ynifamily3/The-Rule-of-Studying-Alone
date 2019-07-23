// server.js
const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 80;

const dbConnect = require('./back/models');
const passportConfig = require('./back/passport');
const bodyParser = require('body-parser');
const passport = require('passport');

const ExpressApp = express();
const NextApp = next({
  dev,
  quiet: dev,
  dir: "./next",
  conf: {
    // next.config.js 에서 사용하는 객체 값
    webpack: {}
  }
});
const NextHandler = NextApp.getRequestHandler();

// const CustomRouter = require("./routes");
const NextRouter = express.Router();


/*
NextRouter.get("/route-b", (req, res) => {
  const result = {
    "SOME RESULT": "FROM DB"
  };
  res.result = result;

  return NextApp.render(
    req,
    res,
    "route-b",
    Object.assign({}, req.query, req.param)
  );
});
*/

NextRouter.use('/api',require('./back/routes'));
NextRouter.get("*", (req, res) => NextHandler(req, res));

NextApp.prepare().then(() => {
  /*ExpressApp.use( SOME MIDDLEWARE 1 );
  ExpressApp.use( SOME MIDDLEWARE 2 );*/
	// ExpressApp.use("/api", CustomRouter);
	dbConnect();
	ExpressApp.use(bodyParser.json());
	ExpressApp.use(bodyParser.urlencoded({extended:true}));
	passportConfig(ExpressApp,passport);

	ExpressApp.use("/",NextRouter);

  ExpressApp.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening on ::${PORT}`);
  });
});
