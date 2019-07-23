const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
	auth_method:{
		type:String,
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
	social:{
		naver:{
			access_token:String,
			id:String,
			displayName:String,
		}
	},
	createdAt:{
		type: Date,
		default: Date.now,
		  },
		});

module.exports = mongoose.model('userinfo',userSchema,'userinfo');
