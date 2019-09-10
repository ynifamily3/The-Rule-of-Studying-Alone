const Info = require('./info');
const Soup = require('./soup');
const Util = require('./util');

/*
	Quest 쓰는 방법

	1. 문제 만들기
	let quest = Quest.{만들고 싶은 문제에 해당하는 생성 함수}([인자])
	quest.statement	// 지문
	quest.choices	// 선택지로 보여줄 문자열 집합
	quest.answers	// 정답

	2. 문제 매기기
	boolean Quest.evaluate(quest, response)

	3. 참/거짓 문제
	Quest Quest.generate_binary_quest(Info g);

	참/거짓 문제의 response는 ['T'] 또는 ['F'] 여야 한다.
	
	4. n지선다 문제
	Quest Quest.generate_selection_quest(Info g, int n, int a, boolean inv)
		n: 선택지 수
		a: 골라야 하는 답의 수
		inv: 참이면 '옳지 않은 것', 거짓이면 '옳은 것'

	n지선다 문제의 response는 ['0', '3', ...], 즉 음이 아닌 정수를 나타낸
	문자열의 집합이어야 한다.

	5. 단답형 문제
	Quest Quest.generate_short_quest(Info g, int n);
		n: 주어지는 정보 수

	이 이외의 함수는 건드렸을 때 책임 안짐
*/

class Quest {
	/*
		type은 {'binary', 'selection', 'short'} 중 하나일 것
	*/
	constructor(type, statement, choices, answers, materials) {
		console.assert(type);
		console.assert(statement);
		console.assert(choices instanceof Array);
		console.assert(answers instanceof Array);
		this.type = type;
		this.statement = statement;
		this.choices = choices;
		this.answers = answers;
		this.materials = materials;
	}
}

Quest.evaluate = function(quest, response) {
	return Quest.evaluator[quest.type](quest, response);
};

Quest.evaluator = {};

// 참/거짓 유형 문제 생성
Quest.generate_binary_quest = function(g, material) {
	// let subinfos = Soup.fetch_subinfos([g]).filter(info => {
	// 	return info.attrs.length > 0;
	// });
	// let material = Util.get_randomly(subinfos);
	let ans = null;
	let fact = null;
	if(Math.random() > 0.5) {
		ans = 'T';
		fact = Soup.select_positive_attr(material);
	}
	else {
		ans = 'F';
		//if(Math.random() > 0.5)
		// 	fact = Soup.select_negative_attrs(material, 1);
		// else
		// 	fact = Soup.mutate_attr(Soup.select_positive_attr(material));
		fact = Soup.select_negative_attrs(g, material, 1);
	}
	let name = Util.get_randomly(material.names);
	return new Quest('binary', `다음 문장의 참/거짓을 판별하시오.\n`
		+`${material.names[0]}은(는) ${fact}`
		,['T', 'F'], [ans], material);
};

// 참거짓 채점기
// 답을 맞춰야 함
// Info g
Quest.evaluator['binary'] = function(quest, response) {
	if(response.length != 1)
		return false;
	else
		return quest.answers[0] == response[0];
};

// n지선다 유형 문제 생성
// material은 반드시 root가 아니어야 한다. root면 무조건 에러난다.
// 문제 생성에 실패할 경우 에러가 발생한다.
//
// material의 속성의 수는 a (inv가 true이면 n - a)개 이상이어야 한다.
// material: 문제를 출제할 지식
// n: 선택지의 수
// a: 정답의 수
// inv: 옳은/옳지 않은
Quest.generate_selection_quest = function(material, n, a, inv) {
	let p = inv ? n - a : a;

	// 부정 명제를 가져올 범위를 찾는다. 직접
	// 명제의 수를 세기 때문에 최악의 경우 O(n^2)
	// 의 시간 복잡도를 갖지만, n이 1000 미만이라 괜찮을듯.
	// 그래도 최적화가 필요해 보인다
	let g = material;
	while(g.parents.length > 0) {
		// 원리:
		// 자신의 부모 아래의 모든 명제의 수에서 자신의 명제 수를 뺀
		// 것이 선택할 수 있는 부정 명제의 수다.
		// 그렇다면 이 수가 가장 큰 부모를 찾아서, 필요한 부정 명제의
		// 수를 넘을 때까지 거슬러 올라가면 된다.
		let maxv = -1;
		let maxp = null;
		g.parents.forEach(parent => {
			let newv = Soup.total_attrs_count([parent]) - g.attrs.length;
			if(maxv < newv) {
				maxv = newv;
				maxp = parent;
			}
		});
		if(maxp == null)
			break;
		g = maxp;
		if(maxv >= n - p)
			break;
	}

	// 정답 선택지 만들기
	let pos = Soup.select_positive_attrs(material, p);

	// 오답 선택지 만들기
	let neg = Soup.select_negative_attrs(g, material, n - p);

	// 선택지 합치기
	let choices = Util.shuffle(pos.concat(neg), false);
	let answers = null;
	if(inv)
		answers = neg.map(attr => {
			return `${choices.indexOf(attr)}`;
		});
	else
		answers = pos.map(attr => {
			return `${choices.indexOf(attr)}`;
		});
	let name = Util.get_randomly(material.names);

	// 표현
	let logic_label = inv ? '옳지 않은 것' : '옳은 것';
	return new Quest('selection', 
		`다음 중 ${name}에 대한 설명으로 ${logic_label}을 고르시오.`,
		choices, answers, material);
};

// n지선다 채점기
// 답을 모두 맞춰야 함
Quest.evaluator['selection'] = function(quest, response) {
	if(quest.answers.length != reponse.length)
		return false;
	quest.answers.sort();
	response.sort();
	for(let i = 0; i < response.length(); ++i)
		if(quest.answers[i] != response[i])
			return false;
	return true;
};

// 단답식 유형 문제 생성
Quest.generate_short_quest = function(material, n) {
	// 속성이 n개보다 적을 경우, n을 조절해줘서 util.js가
	// 뻑나지 않도록 한다.
	if(material.attrs.length < n)
		n = material.attrs.length;
	let attrs = Soup.select_positive_attrs(material, n);
	let stmt = '다음이 설명하는 것을 적으시오.';
	attrs.forEach(attr => {
		stmt += '\n * ' + attr;
	});
	return new Quest('short', stmt, [], material.names, material);
};

// 단답식 채점기
// 답 중 하나만 맞추면 됨
Quest.evaluator['short'] = function(quest, response) {
	if(response.length != 1)
		return false;
	for(let i = 0; i < quest.answers.length; ++i)
		if(quest.answers[i] == response[i])
			return true;
	return false;
};

module.exports = Quest;