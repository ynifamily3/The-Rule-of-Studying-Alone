const router = require('express').Router();
const passport = require('passport');

const successRedirect = '/'

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return next()
  }
	res.redirect('https://yasm.miel.dev/api/naver/callback')
}

router.get('/',(req,res)=>{
	console.log('test');
	res.json({test:'test'})
});

router.get('/naver',isAuthenticated,passport.authenticate('naver',{
	successRedirect,
	failureRedirect:'/api/auth/naver',
}))

router.get('/naver/callback',isAuthenticated,passport.authenticate('naver',{
	successRedirect,
	failureRedirect:'/api/auth/naver',
}));

module.exports = router;
