const mongoose = require('mongoose');

const {Schema} = mongoose;

const doc = new Schema({
	docs : [],
	name:{
		type:String,
		default:""
	},
	path:{
		type:String,
		defalut:"",
	},
	type:{
		type:String,
		enum:['folder','file'],
		required:true,
	},
	file_id:{
		type:String,
	}
})

const subjectSchema = new Schema({
	name:{
		type:String,
		default:"",
	},
	owner:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'userinfo',
		default:null,
	},
	permission:[],
	docs:[doc],
	files:[],
});



//module.exports = model;
module.exports = mongoose.model('subject_v02',subjectSchema,'Subject_v02');
