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
	//res.redirect('/')
	res.send("<script>window.opener.testCb('fail')</script>");
}

const cookieSet = (req,res)=>{
	let cookie = res.req.user._id;//임시 쿠키값 _id는 db정보라 추후 수정해야함

	return cookie;
}

const login = (req,res)=>{
	let cookie = res.req.user._id;
	console.log("login");
	res.cookie("user",cookie,{
		expires:new Date(Date.now()+9000000),
		httpOnly:true
	})
	res.send("<script>window.opener.testCb('success'); self.close(); </script>");
	//res.redirect("http://127.0.0.1:3000");//test환경
	//res.redirect(successRedirect);
}

	/*
router.get('/',(req,res)=>{

	if(req.cookies.user) res.json({login:'true',cookie:req.cookies.user});
	else res.json({login:'false'});
});
*/

router.get('/logout',(req,res)=>{
	//임시 로그아웃
	if(req.cookies.user)
	{
		res.clearCookie('user');
		res.json({isLogin:false,logout:'success'})
	} else {
		res.json({isLogin:false,logout:'fail'})
	}
	//res.redirect('/');
	//res.send("<script>window.opener.testCb('success'); self.close(); </script>");
})

router.get('/naver',isAuthenticated,passport.authenticate('naver'))

router.get('/naver/callback',isAuthenticated,passport.authenticate('naver'),login);

router.get('/google',isAuthenticated,passport.authenticate('google',{failureRedirect}));

router.get('/google/callback',isAuthenticated,passport.authenticate('google',{failureRedirect,}),login);

router.get('/facebook',isAuthenticated,passport.authenticate('facebook',{failureRedirect}));

router.get('/facebook/callback',isAuthenticated,passport.authenticate('facebook',{failureRedirect,}),login);

module.exports = router;
