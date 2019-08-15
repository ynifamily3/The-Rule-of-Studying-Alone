const docRouter = require('express').Router();
const docsRouter = require('express').Router();

var fileinfo = require('../models/file')
var subjectinfo = require('../models/subject')
const util = require('./util');

const makeSubject = (subject,owner)=>{

	subjectinfo.findOne({name:subject,owner:owner})
		.then((sub)=>{
			if(!sub){
				console.log("make subject");
				let newSubject = new subjectinfo({
					name:subject,
					owner:owner
				});
				newSubject.save()
					.then((subject)=>{
						return true//res.json({result:"post success",subject})
					});
			} else{
				console.log("collision");
				return false//res.json({result:"same subject name"})
			}
		}) 
}
const makeFile= (subject,owner,file_name,contents)=>{
	subjectinfo.findOne({name:subject,owner:owner})
		.then((sub)=>{
			console.log("subject",sub);

			if(!sub){
				return null//return res.status(404).json({error:"subject not fount"})
			} else {
				//res.json({success:"find subject"})

				fileinfo.findOne({name:file_name,subject:sub._id,owner:owner})
					.then((file)=>{
						console.log("file-",file);

						if(!file){
							let newFile = new fileinfo({
								name:file_name,
								owner:owner,
								subject:sub._id,
								soups:contents.infos,
								connections:contents.connections,
								md_text:contents.md_text
							});
							newFile.save()
								.then((f)=>{
									subjectinfo.update({_id:sub._id},{$push:{files:f._id}})
										.then((nf)=>{
											return "make new file"//res.json({result:"make new file"})							
										})
								})
						} else{
							fileinfo.update({_id:file._id},{$set:{
								soups:contents.infos,
								connections:contents.connections,
								md_text:contents.md_text
							}})
								.then((f)=>{
									return "change file"//res.json({result:"change file"})
								})
						}
					})
			}
		})
}



//api/docs
docsRouter.get('/',util.loginCheck,(req,res)=>{
	let docs = [];
	subjectinfo.find({owner:req.cookies.user}).populate('files',{name:1,_id:0})
		.then(async (subjects)=>{
			if(subjects){
				for(sub of subjects){
					let files= [];
					for(f of sub.files){
						files.push(f.name);
					}
					docs.push({folder_name:sub.name,files_name:files})
				
				}
				res.json({docs:docs});
			}
		})
		.catch((err)=>{
			res.json({docs:[]});// subject를 찾을 수 없을 때
		})
});

//api/doc
//docRouter.get('/',(req,res)=>{
//	res.json({test:"test"});
//});

docRouter.get('/:subject_name',util.loginCheck,(req,res)=>{
	console.log("tt");
	subjectinfo.findOne({name:req.params.subject_name,owner:req.cookies.user}).populate('files',{name:1,_id:0})
		.then(async (subject)=>{
			let files= [];
			for(f of subject.files){
				files.push(f.name);
			}
			res.json({files_name:files})
		})
})
docRouter.get('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	subjectinfo.findOne({name:req.params.subject_name,owner:req.cookies.user})
		.then((sub)=>{
			if(!sub){
				res.status(404).json({error:"subject not found"});
			}
			fileinfo.findOne({name:req.params.file_name,subject:sub._id,owner:req.cookies.user},{_id:0,name:0,subject:0,owner:0,__v:0})
				.then((file)=>{
					if(!file){
						res.status(404).json({error:"file not found"})
					}
					res.json(file);
				})
		})
});


docRouter.post('/',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				if(makeSubject(req.body.name,user._id)){
					res.json({result:"post success",subject})
				} else{
					res.json({result:"same subject name"})
				}
			} 
		})
		.catch((err)=>{
			res.status(500).json({error:"data base error"});
		})
});

docRouter.put('/:subject_name',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				if(makeSubject(req.params.subject_name,user._id)){
					res.json({result:"post success",subject})
				} else{
					res.json({result:"same subject name"})
				}
			} 
		})
		.catch((err)=>{
			res.status(500).json({error:"data base error"});
		})
});

docRouter.post('/:subject_name',util.loginCheck,(req,res)=>{

	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				if(makeFile(req.params.subject_name,user._id,req.body.name,req.body)!==null)
					res.json({result:"make file success"})
				else
					res.status(404).json({erorr:"subject not found"});
			}
		})
});

docRouter.put('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	let ret;

	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				if(makeFile(req.params.subject_name,user._id,req.params.file_name,req.body)!==null)
					res.json({result:"make file success"})
				else
					res.status(404).json({erorr:"subject not found"});
			}
		})
});


docRouter.post('/:subject_name',util.loginCheck,(req,res)=>{
	let ret;

	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				if(ret=makeFile(req.params.subject_name,user._id,req.body.name,req.body))
					res.json({result:ret})
				else
					res.status(404).json({erorr:"subject not found"});
			}
		})
});

module.exports = {docRouter,docsRouter};
