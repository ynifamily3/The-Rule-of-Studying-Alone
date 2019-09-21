const Info = require('./info');
const Soup = require('./soup');
const Quest = require('./quest');
const Util = require('./util');

/*
	외부 사용법

	let domains = 선택한 과목/폴더/필기에 해당하는 Info의 배열
	let mocktest = Mocktest.create_mocktest(domains, 문제수)
	mocktest.quests.forEach(q => {
		if(!q)
			return;

		// DOM에 q를 렌더링하기
	})

	가끔 버그로 문제 생성 실패할 때가 있는데 그 문제(quest)는 NULL로
	채워진다. 나중에 버그 수정할 예정이니 NULL 대응 부탁 바람
*/

// 절대 외부에서 이 클래스를 직접 인스턴스화하지 마시오
class Mocktest {
	constructor(quests) {
		console.assert(quests instanceof Array);
		this.quests = quests;
	}
}

// subinfos에서 n개의 문제를 출제한다.
// 최대한 비슷한 수의 문제가 출제되도록 하되
// 정확하게 나누어 떨어지지 않는 경우엔 균등
// 분포로 무작위로 고른다.
Mocktest.select_test_materials = function(roots, n) {
	// 안전장치
	if(n <= 0)
		return [];

	// 재료를 찾는다.
	let subinfos = Soup.fetch_subinfos(roots).filter(info => {
		return info.attrs.length > 0 && roots.indexOf(info) == -1;
	});

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
Mocktest.create_mocktest = function(roots, n) {
	// 문제 출제 범위 생성
	let domains = Mocktest.select_test_materials(roots, n);
	
	let quest_types = [];
	quest_types[0] = Math.floor(n / 4.0);
	quest_types[1] = Math.floor(n / 4.0);
	quest_types[2] = Math.floor(n / 4.0);
	quest_types[3] = n 
		- quest_types[0]
		- quest_types[1]
		- quest_types[2];

	// 각 유형별로 문제를 만든다.
	let quests = [];
	let type_ptr = 0;
	for(let k = 0; k < n; ++k) {
		// 현재 유형을 다 만들면 다음 유형으로 넘어간다.
		if(quest_types[type_ptr]-- <= 0)
			++type_ptr;
		console.assert(type_ptr < quest_types.length);

		// 각 유형에 맞는 문제를 만든다.
		//
		// n지선다 만들 때 이슈가 있는데, 속성의 수가 너무
		// 적은 경우나 부정명제를 못가져오는 상황인 경우
		// 에러가 난다.
		//
		// 이는 루트를 선택하지 못하게 select_test_material을
		// 수정하고, 유저로부터 강제로 3개 이상을 입력하도록
		// 함으로서 해결할 수 있다. 19년 9월 10일 기준 미반영
		let new_quest = null;
		try {
			if(type_ptr == 0)
				new_quest = Quest.generate_binary_quest(roots[0], domains[k]);
			else if(type_ptr == 1) 
				new_quest = Quest.generate_selection_quest(domains[k], 4, 1, Math.random() > 0.5);
			else if(type_ptr == 2)
				new_quest = Quest.generate_short_quest(domains[k], 4);
			else if(type_ptr == 3)
				new_quest = Quest.generate_selection2_quest(domains[k], 4);
			else
				throw new Error('Illegal Quest Type Included: ' + type_ptr);
		}
		catch(err) {
			console.log('[Mocktest::create_mocktest] Fail to create question of')
			console.log(domains[k]);
			console.log(err);
			new_quest = null;
		}
		quests.push(new_quest);
	}

	return new Mocktest(quests);
}

module.exports = Mocktest;