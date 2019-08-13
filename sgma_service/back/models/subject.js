const mongoose= require('mongoose');
const {Schema} = mongoose;

const subjectSchema = new Schema({
	name:{
		type:String,
		default:""
	},
	owner:{
		type:String
	},
	files:{
		type:Array,
		default:[]
	}
});

module.exports = mongoose.model('Subject',subjectSchema,'Subject');
