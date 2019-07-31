const naverID = 'YOUR_ID';
const naverSecret = 'YOUR_SECRET';
const naverURI = encodeURI('YOUR_URI');
exports.naverInfo = {
	clientID:naverID,
	clientSecret:naverSecret,
	callbackURL:naverURI
}

const googleID = 'YOUR_ID';
const googleSecret = 'YOUR_SECRET';
const googleURI = encodeURI('YOUR_URI');
exports.googleInfo = {
	clientID:googleID,
	clientSecret:googleSecret,
	callbackURL:googleURI,
	scope:['https://www.googleapis.com/auth/plus.me']
};

