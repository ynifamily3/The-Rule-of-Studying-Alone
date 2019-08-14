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
	soups:{
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
