//const express = require('express');
const router = require('express').Router();
var userinfo = require('../models/userinfo');
const loginCheck = require('./util').loginCheck;
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/',loginCheck,(req,res,next)=>{
	console.log('get userinfo');
	let users={};

	console.log(req.cookies.user)
	

	userinfo.findOne({_id:new ObjectId(req.cookies.user)},{_id:0,subjects:0})
		.then((user)=>{
			if(!user) return res.stats(404).json({error:'user not found'});
			res.json({isLogin:true,user});
			return
		})
		.catch((err)=>res.status(500).send({error:'database failure'}));
		
	//res.json({test:"test"});
});
/*
router.get('/:id',(req,res)=>{
	console.log(`get userinfo/${req.params.id}`);

	userinfo.findOne({user_id:parseInt(req.params.id)})
		.then((user)=>{
			if(!user) return res.status(404).json({error:'user not found'});
			res.json(user);
		})
		.catch((err)=>res.status(500).send({error:'database failure'}));
});

router.post('/',(req,res)=>{
	console.log('post userinfo');
	console.log(req.body);
	
	let newUser = new userinfo();
	if(req.body.auth_method) newUser.auth_method=req.body.auth_method;
	if(req.body.user_id) newUser.user_id=req.body.user_id;
	if(req.body.nickname) newUser.nickname=req.body.nickname;
	if(req.body.email) newUser.email=req.body.email;
	if(req.body.profile_photo) newUser.profile_photo=req.body.profile_photo;
	let ret = newUser.save()
		.then((test)=>{
			res.json({result:"Post success"})
			console.log("test",test);
		})
		.catch((err)=>res.json({result:"Post error"}));

	console.log("ret",ret);

		
});

router.put('/:id',(req,res)=>{
	console.log('put userinfo');
	userinfo.update({user_id:req.params.id},{$set:req.body})
		.then((user)=>{
			if(!user.n) return res.status(404).json({error:'user not found'});
			res.json({result:'userinfo updated'});
		})
		.catch((err)=>res.status(500).json({error:err}));
});


router.delete('/:id',(req,res)=>{
	console.log(`delete ureinfo/${req.params.id}`);
	userinfo.remove({user_id:req.params.id})
		.then((user)=>{
			if(!user.n) return res.status(404).json({error:'user not found'});
		res.json({result:`id:${req.params.id} user deleted`});
		})
		.catch((err)=>res.status(500).json({error:'database failure'}));
});
*/
module.exports = router;
