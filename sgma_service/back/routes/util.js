var userinfo = require('../models/userinfo');
var soupinfo = require('../models/soup');
var subjectinfo = require('../models/subject')

exports.loginCheck = (req,res,next) => {
	console.log('loginCheck');
	if(req.cookies.user){
		return next()
	}
	res.status(401).send({isLogin:false});
}

exports.subjectCheck = (req,res) =>{
	//실제 코드에서는 해당 서브젝트의 다른 정보를 기준으로 find함
	console.log("subjectCheck");
	subjectinfo.findOne({name:"test"})
		.then((subject)=>{
			console.log("--",subject);
			if(subject) return subject;
		})
		.catch((err)=>res.status(500).send({error:'database failure'}));
}

const connectWrite = (num,_id,connects) =>{
	let cnt=0;

	connects.forEach((connect)=>{
		for(let i=0;i<2;i++)
		{
			if(connect[i]==num)
				connects[cnt][i]=_id;
		}
		cnt++;
	})
	return connects;
}
