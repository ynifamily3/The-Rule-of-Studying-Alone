const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
	auth_method:{
		type:String,
		enum:['naver','google','facebook','direct'],
		default: "direct",
	},
	user_id:{
		type:Number,
		//required:true,
		unique:true
	},
	nickname:{
		type:String,
		required:true,
		default:"unknown",
	},
	email:{
		type:String,
		default:"unknown",
	},
	profile_photo:{
		type:String,
		default:"photoURL",
	},
	/*
	subjects:{
		type:Array,
		default:[],
	},
	*/
	createdAt:{
		type: Date,
		default: Date.now,
		  },
});

userSchema.static.findId=(id,callback)=>{
	this.find({_id:id}.callback)
}

module.exports = mongoose.model('userinfo_v02',userSchema,'userinfo');
