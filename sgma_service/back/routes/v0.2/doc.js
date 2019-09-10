const docRouter = require('express').Router();
const docsRouter = require('express').Router();

var fileinfo = require('./models/file')
var subjectinfo = require('./models/subject')
const util = require('./util')

//api/docs
docsRouter.get('/',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			subjectinfo.find({owner:user._id},{name:1,_id:0})
				.then(async (subjects)=>{
					let docs =[]
					for(sub of subjects){
						await docs.push(sub);
					}

					return res.json({test:docs});
				})
		})
	//res.json({code:'get',test:"docs"})
});

docRouter.get('/:subject_name',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id})
					.then((sub)=> {
						if(sub) {
							return res.json({docs:sub.docs})
						} else {
							return res.json({error:"subject not found"})
						}
					})
			} else {
				return res.json({error:"user failed"})
			}
		})
	//res.json({code:'get',test:"/:subject_name", subject_name:req.params.subject_name})
});

docRouter.put('/:subject_name',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id},{path:0})
					.then((sub)=>{
						if(!sub){
							let newSub = new subjectinfo({
								name:req.params.subject_name,
								owner:user._id,
								files:[]
							})
							newSub.save()
								.then((newSubject)=>{
									return res.json({result:"make subject success"})
								})
						} else {
							console.log("collision")
							return res.json({result:"same subject name"})
						}
					})
			} else {
				return res.json({error:"user failed"})
			}
	})
	//res.json({code:'put',test:"/:subject_name", subject_name:req.params.subject_name})
});

docRouter.delete('/:subject_name',util.loginCheck,(req,res)=>{
	res.json({code:'get',test:"/:subject_name", subject_name:req.params.subject_name})
});

docRouter.get('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	//res.json({code:'get',test:"/:subject_name/:file_name", subject_name:req.params.subject_name, file_name:req.parmas.file_name})
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			subjectinfo.findOne({name:req.params.subject_name,owner:user._id})
				.then((sub)=>{
					if(sub){
						if(req.query.path!==undefined)
							var path = req.query.path.split('/');
						else
							var path = []
						let docs = sub.docs;
						let flag = true;
						//console.log("test");
						for(folder of path){
							if(flag){
								flag= false;
								for(var doc of docs){
									if(folder===doc.name){
										docs=doc.docs;
										flag=true;
										break;
									}
								}
							} else {
								return res.status(404).json({error:"file not found"});
							}
						}
							/*
						if(doc.type==="folder"){
							return res.json(doc);
						} else {
							fileinfo.findOne({_id:doc.file_id},{soup:1,connections:1,md_text:1,_id:0})
								.then((file)=>{
									return res.json(file);
								})
						}
						*/
						console.log(doc);
						return res.json({test:"test"});
					} else {
						return res.status(404).json({error:"subject not found"});
					}
				})
		})
});

docRouter.put('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				//현재 문제가 있음 전체적으로 수정 필요
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id})
					.then((sub)=>{
						if(sub){
							if(req.body.type==="folder"){//폴더 생성
								return res.json({test:"folder"})
							} else {//파일 생성

								return res.json({file:"file"})
							}
							
						} else {
							return res.json({error:"can't find subject"})
						}
					})
				//return res.json({test:"test"})
			} else {
				return res.json({error:"user failed"})
			}
		})

});

docRouter.delete('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	res.json({code:'delete',test:"/:subject_name/:file_name", subject_name:req.params.subject_name, file_name:req.parmas.file_name})
})

module.exports = {docRouter,docsRouter};
