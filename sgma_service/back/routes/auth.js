const router = require('express').Router();
const passport = require('passport');

const successRedirect = '/'
const failureRedirect = '/login'//로그인 창

const isAuthenticated = (req, res, next) => {
	//login cookie 존재 시 로그인 안됨
	if (!req.cookies.user) {
		return next()
	}
	else console.log('auth');
	res.redirect('/')
}

const cookieSet = (req,res)=>{
	let cookie = res.req.user._id;//임시 쿠키값 _id는 db정보라 추후 수정해야함

	return cookie;
}

router.get('/',(req,res)=>{

	if(req.cookies.user) res.json({login:'true',cookie:req.cookies.user});
	else res.json({login:'false'});
});

router.get('/logout',(req,res)=>{
	//임시 로그아웃
	res.clearCookie('user');
	res.redirect('/');
})

router.get('/naver',isAuthenticated,passport.authenticate('naver',{
	failureRedirect,
}))

router.get('/naver/callback',isAuthenticated,passport.authenticate('naver',{
	failureRedirect,
}),(req,res)=>{
	let cookie = cookieSet(req,res);
	res.cookie("user",cookie,{
		expires:new Date(Date.now()+900000),
		httpOnly:true
	})
	res.redirect(successRedirect);
});

module.exports = router;
