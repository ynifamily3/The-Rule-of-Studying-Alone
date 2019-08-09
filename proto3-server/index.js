// 웹개발 테스트용 서버
// 입력받은 걸 그대로 돌려준다
//
// proto3.html로부터 데이터를 주고받으려면 CORS 허용을 해줘야
// 하는데, 그때문에 express.js용 미들웨어 cors를 설치해야한다.
let express = require('express');
let cors = require('cors');
let app = express();
let port = 1004;
let cors_option = {
	origin: function(origin, cb) {
		// CORS 표준이 포함된 경우, origin을 확인한다.
		console.log(`CORS request from ${origin}`);

		// origin에 따라서 cb(new Error())를 호출하여
		// 요청을 차단할 수도 있다. 여기선 그냥 무조건 허용
		cb(null, true);
	}
};

// 환경설정
app.use(express.json());
app.options('/', cors()); // 사전확인(Preflight) 허용
app.post('/', cors(cors_option), (req, res) => {
	console.log(req.body);
	res.json(req.body);
});

// 서버열기
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});