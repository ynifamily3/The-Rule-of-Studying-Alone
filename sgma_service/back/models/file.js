const mongoose = require('mongoose');
const {Schema} = mongoose;

const fileSchema = new Schema({
	name:{
		type:String,
		default:""
	},
	subject:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Subject',
		required:true,
	},
	owner:{
		type:mongoose.Schema.Types.ObjectId,
		required:true,
	},
	parent_id:{
		type:mongoose.Schema.Types.ObjectId
	},
	path:{
		type:String,
		default:"",
	},
	type:{
		type:String,//folder or file
		enum:['folder','file'],
		required:true,
	},
	files:[{type:mongoose.Schema.Types.ObjectId,ref:'file'}],
	infos:{
		type:Array,
		default:[]
	},
	connections:{
		type:Array,
		default:[]
	},
	md_text:{
		type:String,
		default:""
	}
});

fileSchema.static.findName=(name,callback)=>{
	this.findOne({name:name},callback)
}

module.exports = mongoose.model('file',fileSchema,'File');
