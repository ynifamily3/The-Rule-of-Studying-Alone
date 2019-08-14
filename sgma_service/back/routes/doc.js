const docRouter = require('express').Router();
const docsRouter = require('express').Router();

var fileinfo = require('../models/file')
var subjectinfo = require('../models/subject')

//api/docs
docsRouter.get('/',(req,res)=>{
	res.json({test:"ss"});
});

//api/doc
docRouter.get('/',(req,res)=>{
	res.json({test:"test"});
});

docRouter.get('/:subject_name/:file_name',(req,res)=>{
	subjectinfo.findOne({name:req.params.subject_name,owner:null})
		.then((sub)=>{
			if(!sub){
				res.status(404).json({error:"subject not found"});
			}
			fileinfo.findOne({subject:sub._id},{_id:0,name:0,subject:0,__v:0})
				.then((file)=>{
					if(!file){
						res.status(404).json({error:"file not found"})
					}
					res.json(file);
				})
		})
});
 

docRouter.post('/:subject_name',(req,res)=>{
	//테스트 버전 -> owner 체크 추가 안됨
	subjectinfo.findOne({name:req.params.subject_name,owner:null})
		.then((sub)=>{
			if(!sub){
				console.log("make subject");
				let newSubject = new subjectinfo({
					name:req.params.subject_name
					//owner코드
				});
				newSubject.save()
					.then((subject)=>{
						res.json({result:"post success",subject})
					});
			} else{
				console.log("collision");
				res.json({result:"same subject name"})
			}
		})

});

docRouter.post('/:subject_name/:file_name',(req,res)=>{
	//현재는 add만 존재
	//let mode = req.body.type;
	
	subjectinfo.findOne({name:req.params.subject_name,owner:null})
		.then((sub)=>{
			console.log("subject",sub);

			if(!sub){
				return res.status(404).json({error:"subject not fount"})
			} else {
				//res.json({success:"find subject"})

				fileinfo.findOne({name:req.params.file_name,subject:sub._id})
					.then((file)=>{
						console.log("file-",file);

						if(!file){
							let newFile = new fileinfo({
								name:req.params.file_name,
								subject:sub._id,
								soups:req.body.infos,
								connections:req.body.connections,
								md_text:req.body.md_text
							});
							newFile.save()
								.then((f)=>{
									subjectinfo.update({_id:sub._id},{$push:{files:f._id}})
										.then((nf)=>{
											res.json({result:"make new file"})							
										})
								})
						} else{
							fileinfo.update({_id:file._id},{$set:{
								soups:req.body.infos,
								connections:req.body.connections,
								md_text:req.body.md_text
							}})
								.then((f)=>{
									res.json({result:"change file"})
								})
						}
					})
			}
		})
	
});

module.exports = {docRouter,docsRouter};
