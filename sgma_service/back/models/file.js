const mongoose= require('mongoose');
const {Schema} = mongoose;

const fileSchema = new Schema({
	name:{
		type:String,
		default:""
	},
	comment:{
		type:String,
		default:""
	},
	owner:{
		type:String
	},
	childs:{
		type:Array,
		default:[]
	},
	connections:{
		type:Array,
		defualt:[]
	}
});

module.exports = mongoose.model('File',fileSchema,'File');
