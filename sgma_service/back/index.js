//back/index.js

const connect = require('./models');
const bodyParser = require('body-parser');
exports.start = (app)=>{
	connect();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	//app.use('/api/auth',require('./routes/auth'));
	app.use('/api/userinfo',require('./routes/userinfo'));
}
