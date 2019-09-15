//const express = require('express');
const router = require('express').Router();
var userinfo = require('./models/userinfo');
const loginCheck = require('./util').loginCheck;
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/',loginCheck,(req,res,next)=>{
	console.log('get userinfo');
	let users={};

	console.log(req.cookies.user)
	

	userinfo.findOne({_id:new ObjectId(req.cookies.user)},{_id:0,subjects:0})
		.then((user)=>{
			if(!user) return res.stats(404).json({error:'user not found'});
			return res.json({isLogin:true,user});
		})
		.catch((err)=>res.status(500).send({error:'database failure'}));
		
});

module.exports = router;
