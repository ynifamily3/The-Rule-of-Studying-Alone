const mongoose = require('mongoose');

const {Schema} = mongoose;
const folderSchema = new Schema({
	name:{
		type:String,
		default:"",
	},
	subject:{
		type:mongoose>Schema.Types.ObjectId,
		ref:'Subject',
		required:true,
	},
	owner:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'userinfo',
		default:null,
	},
	parent_id:{
		type:mongoose.Schema.Types.ObjectId
	},
	path:{
		type:String,
		default:"",
	}
	files:[]
});
//const model = mongoose.model('subject',subjectSchema,'Subject');

subjectSchema.statics.findId=(id,callback)=>{
	this.findOne({owner:id},callback)
}

subjectSchema.statics.findNameId=(name,id,callback)=>{
	findOne({name:name,owner:id},callback);
}

//module.exports = model;
module.exports = mongoose.model('folder',subjectSchema,'File');
