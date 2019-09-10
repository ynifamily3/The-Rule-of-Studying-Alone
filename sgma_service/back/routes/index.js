const userinfoRouter = require('./userinfo');
const authRouter = require('./auth');
const soupRouter = require('./soup');
const {docRouter,docsRouter} = require('./doc');
const router = require('express').Router();
const cors = require('cors');
const v01 = require('./v0.1');
const v02 = require('./v0.2');

var whitelist = ['https://yasm.miel.dev',
'http://127.0.0.1',
'http://127.0.0.1:3000',
'https://127.0.0.1',
'https://127.0.0.1:3000',
'http://localhost',
'http://localhost:3000',
'https://localhost',
'https://localhost:3000']

	
router.all('/*',(req,res,next)=>{
	//var origin = req.headers.origin;
	if(whitelist.indexOf(req.headers.origin)>-1)
	{
		console.log("origin",req.headers.origin);
		res.header('Access-Control-Allow-Origin', req.headers.origin);
	}
	
	//res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	
	res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	next();
})


router.use('/userinfo',userinfoRouter);
router.use('/auth',authRouter);
//router.use('/soup',soupRouter);
router.use('/doc',docRouter);
router.use('/docs',docsRouter);

router.use('/v0.1',v01);
router.use('/v0.2',v02);

module.exports = router;
