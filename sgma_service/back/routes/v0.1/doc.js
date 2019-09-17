const docRouter = require('express').Router();
const docsRouter = require('express').Router();
const soupRouter = require('express').Router();
const searchRouter = require('express').Router();

var fileinfo = require('../../models/file')
var subjectinfo = require('../../models/subject')
const util = require('./util');
const Ranker = require('../../util/ranker');

const makeSubject = (res,subject,owner)=>{

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
						return res.json({result:"make subject success"})
					});
			} else{
				console.log("collision");
				return res.json({result:"same subject name"})
			}
		}) 
}

const setPath = (res,subject,owner,file_name,body) => {
	console.log("setPath")
	subjectinfo.findOne({name:subject,owner:owner})
		.then(async (sub)=>{
			console.log("subject",sub);
			if(!sub){
				return res.json({error:"can't find subject"})
			} else {
				if(body.path===""||body.path===undefined){
					return makeFile(res,null,sub,owner,file_name,body)
					//return res.json({success:"success"})
				} else {
					fileinfo.findOne({subject:sub._id,owner:owner,path:body.path,type:"folder"})
						.then(async (parent)=>{
							if(parent){
								console.log("parent path",parent.path);
								console.log("parent",parent);
								return makeFile(res,parent,sub,owner,file_name,body)
							} else {
								return res.json({failed:"path fail"})
							}
							//return res.json({success:"success2"})
						})			
				}

			}
		})
}

const makeFile = (res,parent,sub,owner,file_name,body) =>{
	console.log("makefile")
	if(parent)
		var my_path=parent.path+"/"+file_name;
	else
		var my_path="/"+file_name;
	fileinfo.findOne({name:file_name,subject:sub._id,owner:owner,path:my_path})
		.then((file)=>{
			console.log("file",file);
			console.log("soup0---------",body.soups)
			if(!file){
				console.log("파일 생성")
				let newFile = new fileinfo({
					name:file_name,
					subject:sub._id,
					owner:owner,
					path:my_path,
					soups:body.soups,
					connections:body.connections,
					md_text:body.md_text,
					type:body.type
				});
				if(parent) newFile.parent_id=parent._id;
				console.log("newFile",newFile)
				newFile.save()
					.then((f)=>{
						subjectinfo.update({_id:sub._id},{$push:{files:f._id}})
							.then((u_sub)=>{
								if(parent!==null)
									fileinfo.update({_id:parent._id},{$push:{files:f._id}})
										.then((f)=>{
											console.log("file update");
											return res.json({success:"new file"})
										})
								else return res.json({success:"new file"})
							})
					})
			} else {//중복 파일 시
				console.log("파일 덮어씌우기");
				fileinfo.updateOne({_id:file._id},{$set:{
					soups:body.soups,
					connections:body.connections,
					md_text:body.md_text,
					type:body.type
				}})
					.then((f)=>{
						return res.json({success:"overwrite file"})
					})
			}
		})
	console.log("parent path",my_path)

}
async function makeSub(sub){
	let files= [];
	for(f of sub.files){
		if(!f.parent_id){
			if(f.type==="folder"){
				await files.push({type:f.type,name:f.name,docs:await makeDocs(f.files)});
			} else
				await files.push({type:f.type,name:f.name});
		}
	}
	return files;
}
async function makeDocs(file_ids){
//const makeDocs = (file_ids)=>{
	let array=[];

	for(id of file_ids){
		
		await fileinfo.findOne({_id:id})
			.then(async (file)=>{
				//let file_ary = [];
				if(file)
				{
					if(file.type==="folder"&&file.files!=[])
					{
						array.push({type:file.type,name:file.name,docs:await makeDocs(file.files)})
					} else {
						array.push({type:file.type,name:file.name})
					}
				}
			})
			
	}
	return array;
}

//api/docs
docsRouter.get('/',util.loginCheck,(req,res)=>{
	let docs = [];
	console.log('docs');
	subjectinfo.find({owner:req.cookies.user}).populate('files',{name:1,type:1,files:1,parent_id:1,_id:0})
		.then(async (subjects)=>{
			console.log(subjects)
			if(subjects){
				for(sub of subjects){
					await docs.push({subject_name:sub.name})
					//await docs.push({subject_name:sub.name,docs:await makeSub(sub)})
				}
				res.json({subjects:docs});
			}
		})/*
		.catch((err)=>{
			console.log("bug");
			res.json({docs:[]});// subject를 찾을 수 없을 때
		})
		*/
});



docRouter.get('/:subject_name',util.loginCheck,(req,res)=>{
	subjectinfo.findOne({name:req.params.subject_name,owner:req.cookies.user,parent_id:null}).populate('files',{name:1,type:1,files:1,parent_id:1,_id:1})
		.then(async (subject)=>{
			let files= [];
			if(subject){
				for(f of subject.files){
					console.log("name----",f.name);
					console.log("p_id----",f.parent_id);
					if(!f.parent_id){
						console.log("check=====")
						if(f.type==="folder"){
							//let array=await makeDocs(f.files);
							await files.push({type:f.type,name:f.name,docs:await makeDocs(f.files)});
						} else
							await files.push({type:f.type,name:f.name});
					}
				}
				res.json({docs:files})
			} else {
				res.json({error:"subject not found"})
			}
		})
})
docRouter.get('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	console.log("req.doby.path",req.body.path);
	console.log("file_name",req.params.file_name);
	console.log("query",req.query.path)
	//res.json({test:req.params.file_name})
	if(req.query.path)
		var my_path = req.query.path + "/" + req.params.file_name
	else
		var my_path = "/"+req.params.file_name
	
	subjectinfo.findOne({name:req.params.subject_name,owner:req.cookies.user})
		.then((sub)=>{
			if(!sub){
				res.status(404).json({error:"subject not found"});
			}
			//상위의 경로를 query로 받음 -> 자기자신의 경로가 아님
			fileinfo.findOne({name:req.params.file_name,subject:sub._id,owner:req.cookies.user,path:my_path},{_id:0,subject:0,owner:0,parent_id:0,__v:0}).populate('files',{name:1,type:1,_id:0})
				.then((file)=>{
					if(!file){
						res.status(404).json({error:"file not found"})
					} else {
						res.json(file);
					}
				})
				.catch((err)=>{res.json({error:"check"})})
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
				makeSubject(res,req.params.subject_name,user._id)
			} else
				res.json({error:"user failed"})
		})
		.catch((err)=>{
			res.status(500).json({error:"data base error"});
		})
});



docRouter.put('/:subject_name/:file_name',util.loginCheck,(req,res)=>{

	console.log(req.body.path);
		
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				setPath(res,req.params.subject_name,user._id,req.params.file_name,req.body)
			} else
				res.json({error:"user failed"})
		})
		.catch((err)=>{
			res.status(500).json({error:"data base error"});
		})
		
});

docRouter.delete('/:subject_name',util.loginCheck,(req,res)=>{
	console.log("subject",req.params.subject_name);

	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id})
					.then(async (sub)=>{
						if(sub){
							for(file_id of sub.files){
								await fileinfo.remove({_id:file_id})
							}
							await subjectinfo.remove({_id:sub._id})
							return res.json({result:"subject delete success"})
						} else {
							return res.json({result:"can't find subject"})
						}
					})
			} else {
				return res.json({error:"user failed"})
			}
		})
		.catch((err)=>{
			res.status(500).json({error:"data base error"});
		})

});

docRouter.delete('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	console.log("subject",req.params.subject_name)
	console.log("file",req.params.file_name);
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user)
			{
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id}).populate('files',{name:1,type:1,files:1,parent_id:1,path:1,_id:1})
					.then(async (subject)=>{
						if(subject){
							if(req.query.path)
								var my_path = req.query.path+"/"+req.params.file_name;
							else
								var my_path = "/"+req.params.file_name;
							console.log("path",my_path)
							for(f of subject.files){
								//console.log(f.path)
								if(f.path.indexOf(my_path)==0){
									console.log("fname",f.name,f.path)
									await fileinfo.remove({_id:f._id})
									await subject.update({_id:subject._id},{$pull:{files:f._id}})
								}
							}
							res.json({result:"delete file success"});
						} else {
							res.json({error:"can't find subject"});
						}
					})
			} else
				res.json({error:"user failed"})
		})
		.catch((err)=>{
			res.status(500).json({error:"data base error"});
		})

})

async function makeSoup(soups,connections,index,parent,f){

	console.log("====================")
	console.log("top")

	console.log("f",f);

	if(f.type==="folder"){
		soups.push({names:[f.name,],attrs:[],comment:""})
		//soups.push({names:[f.name,],type:f.type,path:f.path})
		if(parent!==-1)
		{
			connections.push([parent,index])
		}
			parent = index;

		index++;
		for(file of f.files){
			await fileinfo.findOne({_id:file})
				.then(async (ff)=>{
					[soups,connections,index]= await makeSoup(soups,connections,index,parent,ff);
				})
		}
	} else {
		var top = [];
		var cursor = index;
		
		for(s of f.soups){
			soups.push(s);
			//soups.push({names:s.names,type:f.type,path:f.path})
			top.push(true);
			index++;
		}

		for(c of f.connections){
			top[c[1]]=false;
			connections.push([c[0]+cursor,c[1]+cursor])
		}
		var i=0
		if(parent!==-1)
		{
			for(t of top){
				if(t){
					connections.push([parent,i+cursor]);
				}
				i++;
			}
		}
		
		//console.log("soup",f.soups)
		//console.log("connections",f.connections)
	}
	console.log("====================")

	return [soups,connections,index]
}

soupRouter.get('/:subject_name',util.loginCheck,(req,res)=>{
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id,parent_id:null}).populate('files')//,{name:1,type:1,files:1,parent_id:1,_id:1})
					.then(async (subject)=>{
						if(!subject){
							res.status(404).json({error:"subject not found"});
						} else {
							var soups = [];
							var connections = [];
							var index=1;
						
							soups.push({names:[subject.name,],attrs:[],comment:""})

							for(f of subject.files){
								if(!f.parent_id){
									//if(f.type==="folder"){
									[soups,connections,index]=await makeSoup(soups,connections,index,0,f);
								//}
								}
							}
							console.log("soup----",soups)
							console.log("connections----",connections)
							return res.json({soups:soups,connections:connections});
						}
					})
			} else {
				return res.json({error:"user failed"})
			}
			
		})
})

soupRouter.get('/:subject_name/:file_name',util.loginCheck,(req,res)=>{
	console.log("rr",req.query.path)
	if(req.query.path)
		var my_path = req.query.path + "/"+req.params.file_name;
	else
		var my_path = "/"+req.params.file_name;

	console.log("my_path",my_path)
	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			if(user){
				subjectinfo.findOne({name:req.params.subject_name,owner:user._id,parent_id:null}).populate('files')//,{name:1,type:1,files:1,parent_id:1,_id:1})
					.then(async (subject)=>{
						if(!subject){
							return res.status(404).json({error:"subject not found"});
						} else {
							fileinfo.findOne({name:req.params.file_name,subject:subject._id,owner:user._id,path:my_path})
								.then(async (file)=>{
									if(!file){
										res.status(404).json({error:"file not found"})
									} else {
										var soups = [];
										var connections = [];
										var index = 0;

										if(file.type==="folder"){
											[soups,connections,index]=await makeSoup(soups,connections,0,-1,file);
										} else {
											//[soups,connections,index]=await makeSoup(soups,connections,0,-1,file);
											soups=file.soups;
											connections = file.connections;
										}
									}
									console.log("soup----",soups)
									console.log("connections----",connections)
									return res.json({soups:soups,connections:connections});
								})
						}
					})
			}
		})
})

searchRouter.get('/:subject_name',util.loginCheck,(req,res)=>{
	console.log("search")

	util.decodeCookie(req.cookies.user)
		.then((user)=>{
			subjectinfo.find({owner:user._id},{name:1,_id:0})
				.then((subs)=>{
					var result = Ranker.find_top_k_match(req.params.subject_name,subs,subs.length);

					console.log(result);
					return res.json({result:result})
					
					//return res.json({test:"test"})
				})
		})

})

module.exports = {docRouter,docsRouter,soupRouter,searchRouter};
