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
		userinfo.findOne({'social.naver.id':profile.id})
			.then(user=>{
				if(!user){
					const newUser = new userinfo();
					newUser.auth_method='naver';
					newUser.social.naver.access_token = accessToken;
					newUser.social.naver.id = profile.id;
					newUser.social.naver.displayName = profile.displayName;
					return newUser.save()
						.then(user=>done(null,user))
						.catch(err=>done(err,false));
				}
				return done(null,user);
			})
			.catch(e=>done(e,false));
	}));

}
