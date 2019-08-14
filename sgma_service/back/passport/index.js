const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const {naverInfo,googleInfo,facebookInfo}=require('./secret');
//const {naverInfo,googleInfo,facebookInfo}=require('./real_secret');


const userinfo = require('../models/userinfo');
require('dotenv').config();

//const loginSuccess = (platform,profile,done)=>{
const loginSuccess = (platform,id,nickname,email,photo,done)=>{
	userinfo.findOne({auth_method:platform,user_id:id})
		.then(user=>{
			console.log(platform,'findOne');
			if(!user){
				const newUser = new userinfo();
				newUser.auth_method=platform;
				//newUser.social.naver.access_token = accessToken;
				newUser.user_id=id;
				if(nickname)newUser.nickname=nickname;
				if(email)newUser.email=email;
				if(photo)neuser.profile_photo=photo;
				return newUser.save()
					.then(user=>done(null,user))
					.catch(err=>done(err,false));
			}
			return done(null,user);
		})
		.catch(e=>done(e,false));
};


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

	passport.use('naver',new NaverStrategy(naverInfo,(accessToken,refreshToken,profile,done)=>{
		let email = profile._json.email;
		let nickname = profile._json.nickname;
		let profile_photo = profile._json.profile_image;
		let id = profile._json.id;
		//	loginSuccess('naver',profile,done);
		console.log(profile);
		loginSuccess(profile.provider,id,nickname,email,profile_photo,done);
	}));
	
	passport.use('google',new GoogleStrategy(googleInfo,(accessToken,refreshToken,profile,done)=>{
		let email;
		let nickname=profile.displayName;
		let profile_photo=profile._json.picture;
		let id=profile.id;
		//loginSuccess('google',profile,done);
		console.log(profile);
		loginSuccess(profile.provider,id,nickname,email,profile_photo,done);
	}));
	
	passport.use('facebook',new FacebookStrategy(facebookInfo,(accessToken,refreshToken,profile,done)=>{
		//console.log(profile);
		let email;
		let nickname = profile.displayName;
		let profile_photo;
		let id = profile._json.id;
		loginSuccess(profile.provider,id,nickname,email,profile_photo,done);

	}));
}
