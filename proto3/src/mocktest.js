const Info = require('./info.js');
const Quest = require('./quest.js');
const Util = require('./util.js');

const Mocktest = {};

// subinfos에서 n개의 문제를 출제한다.
// 최대한 비슷한 수의 문제가 출제되도록 하되
// 정확하게 나누어 떨어지지 않는 경우엔 균등
// 분포로 무작위로 고른다.
Mocktest.select_test_materials = function(subinfos, n) {
	// 안전장치
	if(n <= 0)
		return [];

	// 초기화
	let ratio = [];
	let m = subinfos.length;
	let quotient = Math.floor(n / m);
	for(let i = 0; i < m; ++i)
		ratio[i] = quotient;
	n -= quotient * m;
	
	// 나머지는 랜덤분배
	if(n > 0) {
		Util.random_choices(0, m - 1, n).forEach(idx => {
			ratio[idx] += 1;
		});
	}

	// 분배된 만큼 지식을 리스트로 나열한다.
	// ex) [1번지식, 1번지식, 4번지식, 9번지식 ...]
	let out = [];
	for(let i = 0; i < ratio.length; ++i)
		for(let k = 0; k < ratio[i]; ++k)
			out.push(subinfos[i]);

	// 순서를 적절히 섞는다.
	// 2번째 인자는 outplace = false
	return Util.shuffle(out, false);
}

// Info[] 	roots 	문제 출제 범위
// Number 	n 		문제 출제 수
// function create_mocktest(roots, n) {
// 	let subinfos = Soup.fetch_subinfos(roots);
// 	Util.get_randomly_multi_dup(subinfos, n);
// }

module.exports = Mocktest;