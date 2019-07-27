//const express = require('express');
const router = require('express').Router();
var userinfo = require('../models/userinfo');

router.get('/',(req,res,next)=>{
	console.log('get userinfo');
	let users={};

	if(req.cookies.user){
		userinfo.findOne({_id:req.cookies.user})
			.then((user)=>{
				if(!user) return res.stats(404).json({error:'user not found'})
				res.json({isLogin:true,user});
			})
			.catch((err)=>res.status(500).send({error:'database failure'}));
	}
	else res.status(401).send({isLogin:false});

	/*
	userinfo.find()
		.then((user)=>{
			users['userinfo']=user;
			res.json(users);
		})
		.catch((err)=>res.status(500).send({error:'database failure'}));
	*/
});

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
	
	let newUser = new userinfo();
	if(req.body.auth_method) newUser.auth_method=req.body.auth_method;
	if(req.body.user_id) newUser.user_id=req.body.user_id;
	if(req.body.nickname) newUser.nickname=req.body.nickname;
	if(req.body.email) newUser.email=req.body.email;
	if(req.body.profile_photo) newUser.profile_photo=req.body.profile_photo;
	newUser.save()
		.then(()=>res.json({result:"Post success"}))
		.catch((err)=>res.json({result:"Post error"}));
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

module.exports = router;
