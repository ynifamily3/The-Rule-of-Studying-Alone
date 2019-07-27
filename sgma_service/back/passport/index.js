const NaverStrategy = require('passport-naver').Strategy;
const {naverID,naverSecret,naverURI}=require('./secret');
//const {naverID,naverSecret,naverURI}=require('./real_secret');


const userinfo = require('../models/userinfo');
require('dotenv').config();

module.exports = (app,passport)=>{
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user,done)=>{
		console.log('serialize');
		done(null,user.id);
	});

	passport.deserializeUser((_id, done) => {
    console.log('deserialize')
    User.findById({ _id })
        .then(user => done(null, user))
        .catch(e => done(e, false))
	});

	passport.use('naver',new NaverStrategy({
		clientID:naverID,
		clientSecret:naverSecret,
		callbackURL:naverURI
	},(accessToken,refreshToken,profile,done)=>{
		userinfo.findOne({auth_method:'naver','user_id':profile.id})
			.then(user=>{
				console.log('findone');
				if(!user){
					const newUser = new userinfo();
					newUser.auth_method='naver';
					//newUser.social.naver.access_token = accessToken;
					newUser.user_id = profile.id;
					if(profile.displayName)newUser.nickname = profile.displayName;
					if(profile.email)newUser.email = profile.email;
					return newUser.save()
						.then(user=>done(null,user))
						.catch(err=>done(err,false));
				}
				return done(null,user);
			})
			.catch(e=>done(e,false));
	}));

}
