const mongoose= require('mongoose');
const {Schema} = mongoose;

const soupSchema = new Schema({
	names:{
		type:Array,
		default:[]
	},
	attrs:{
		type:Array,
		default:[]
	},
	comment:{
		type:String,
		default:""
	}
});

module.exports = mongoose.model('Soup',soupSchema,'Soup');
