const mongoose = require('mongoose');

const {Schema} = mongoose;
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
	files:[{type:mongoose.Schema.Types.ObjectId,ref:'File'}]
});
//const model = mongoose.model('subject',subjectSchema,'Subject');

subjectSchema.statics.findId=(id,callback)=>{
	this.findOne({owner:id},callback)
}

subjectSchema.statics.findNameId=(name,id,callback)=>{
	findOne({name:name,owner:id},callback);
}

//module.exports = model;
module.exports = mongoose.model('subject',subjectSchema,'Subject');
