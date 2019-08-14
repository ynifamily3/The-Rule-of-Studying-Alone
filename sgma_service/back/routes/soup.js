const express = require('express');
const router = require('express').Router();
const cors = require('cors');
const {loginCheck,subjectCheck,soupWrite} = require('./util');
//var soupinfo = require('../models/soup');
var fileinfo = require('../models/file');
var subjectinfo = require('../models/subject');
/*
let cors_option = {
	origin: function(origin, cb){
		console.log(`CORS request from ${origin}`);

		cb(null,true);
	}
}

//소스가 더러움 수정 필요
async function addSubject(subject,infos,connect){
	let infos_id=[];
	let cnt = 0;
	for(const info of infos){
		let newInfo = new soupinfo(info);
		let inf = await newInfo.save()
		let soup = await soupinfo.findOne(inf);
		await infos_id.push(soup._id);
	}
	await fileinfo.update({_id:subject._id},{$set:{childs:infos_id,connections:connect}})

	return infos_id;
}

function removeChild(subject){
	//console.log("child ----",subject.childs);
	for (id of subject.childs)
	{
		console.log("remove---",id);
		let resul = soupinfo.remove({_id:id})
		//	console.log("result----",resul);
	}
}

async function setSubject(info){
	let infos = info.infos;
	let connect = info.connections;
	let type = info.type;
	let infos_id = [];

	//실코드에서는 subject를 찾는게 따로 있어야함
	let subject = await subjectinfo.findOne({name:"subject"});
	let file = await fileinfo.findOne({_id:subject.files[0]});
	if(type==='add'&&file){
		await removeChild(file);
		infos_id = await addSubject(file,infos,connect)
	}
	console.log("infos_id",infos_id);
	console.log("connection",connect);
}

router.use(cors());
router.options('/',cors());

router.get('/',(req,res,next)=>{
	console.log('test');
	res.json({test:'test'});
});

router.post('/',cors(cors_option)/*,loginCheck,(req,res,next)=>{
	console.log(req.body);
	//let subject = subjectCheck(req,res);
	//console.log("subject--",subject);
	setSubject(req.body);
	//res.json(subject,req.body);
});
*/
module.exports = router;
