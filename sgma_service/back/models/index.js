const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

module.exports = () =>{
	const connect = () => {
		if(process.env.NODE_ENV !== 'production'){
			mongoose.set('debug',true);
		}
		mongoose.connect('mongodb://localhost:27017/yasm-api',options,(error)=>{
			if(error){
				console.log('mongodb connect error',error);
			} else{
				console.log('mongodb connect success');
			}
		});
	};


	connect();

	mongoose.connection.on('error',(error)=>{
		console.error('mongodb connect error',error);
	});

	mongoose.connection.on('disconnected',()=>{
		console.error('mongodb disconnect, reconnecting now');
		connect();
	});
	
	require('./userinfo');
	//require('./soup');
	require('./subject');
	require('./file');
};
