var userinfo = require('./models/userinfo');
//var soupinfo = require('../models/soup');
var subjectinfo = require('./models/subject')

exports.loginCheck = (req,res,next) => {
	console.log('loginCheck');
	if(req.cookies.user){
		console.log("in");
		return next()
	}
	res.status(200).send({isLogin:false});
	console.log("end")
}

exports.decodeCookie = (cookie)=>{
	//req.cookies.user =>  cookie 값을 해석
	console.log("decodeCookie");
	let decode = cookie // cookie가 현재 임시로 db의 _id값을 사용
	console.log("check decode");

	return userinfo.findOne({_id:decode})
}
