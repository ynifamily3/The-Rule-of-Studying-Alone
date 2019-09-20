(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Soup = require('./src/soup');
const Parser = require('./src/parser');
const Quest = require('./src/quest');
const Protocol = require('./src/protocol');
const Mocktest = require('./src/mocktest');
const Util = require('./src/util');

/*
	모의고사 데모 예시
*/
// 참/거짓 문제를 위한 DOM을 만들어 반환한다.
function create_tfquest_dom(quest) {
	console.assert(quest.type == 'binary');

	let dom = document.createElement('div');
	dom.className = 'section';

	let stmt = document.createElement('p');
	stmt.innerText = `[${quest.title}]${quest.statement}`;
	dom.appendChild(stmt);

	let radio_t = document.createElement('input');
	radio_t.type = 'radio';
	radio_t.checked = (quest.answers[0] == 'T');
	dom.appendChild(radio_t);
	dom.appendChild(document.createTextNode(' T'));
	dom.appendChild(document.createElement('br'));

	let radio_f = document.createElement('input');
	radio_f.type = 'radio';
	radio_f.checked = (quest.answers[0] == 'F');
	dom.appendChild(radio_f);
	dom.appendChild(document.createTextNode(' F'));

	return dom;
}

// 4지선다 문제를 위한 DOM을 만들어 반환한다.
function create_selection_dom(quest) {
	console.assert(quest.type == 'selection' || quest.type == 'selection2');

	let dom = document.createElement('div');
	dom.className = 'section';

	let stmt = document.createElement('p');
	stmt.innerText = `[${quest.title}]${quest.statement}`;
	dom.appendChild(stmt);

	for(let i = 0; i < quest.choices.length; ++i) {
		let checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = (quest.answers.indexOf(`${i}`) != -1);
		dom.appendChild(checkbox);
		dom.appendChild(document.createTextNode(quest.choices[i]));
		dom.appendChild(document.createElement('br'));
	}

	return dom;
}

// 단답형 문제를 위한 DOM을 만들어 반환한다.
function create_short_dom(quest) {
	console.assert(quest.type == 'short');

	let dom = document.createElement('div');
	dom.className = 'section'
	
	let stmt = document.createElement('p');
	stmt.innerText = `[${quest.title}]${quest.statement}`;
	dom.appendChild(stmt);
	dom.appendChild(document.createElement('br'));

	let ans = document.createElement('input');
	ans.type = 'textarea';
	ans.value = quest.answers.toString();
	dom.appendChild(ans);

	return dom;
};

document.getElementById('docs').onchange = function(evt) {
	debug_parse_doc(evt.target.value);
};

let soup = null;

// 파싱 예제
function debug_parse_doc(docstr) {
	// for debug purpose
	let dom = document.querySelector('#tree');
	dom.value = '';
	soup = Parser.parse_doc(docstr);
	console.log(soup);
	dom.value = soup.get_tree();

	// 토폴로지 테스트
	let msg = Protocol.create_message(soup, 'file');
	console.log(msg);

	let newsoup = Protocol.parse_message(msg);
	console.log(newsoup);

	dom.value += newsoup.get_tree();

	// let issues = soup.validation_check({n: 4, a: 1});
	// issues.forEach(issue => {
	// 	alert(issue.what);
	// 	console.log(issue.what);
	// });
}

// 모의고사 생성!
document.getElementById('mocktest').onclick = function() {
	if(!soup)
		return;

	// 문제출제 범위 선택
	let out_dom = document.getElementById('mocktest-out');
	out_dom.innerHTML = '';
	let n = parseInt(document.getElementById('mocktest-n').value);

	// 모의고사 문제 생성
	let mocktest = Mocktest.create_mocktest(soup.roots, n);
	console.log('문제출제 완료');
	console.log(mocktest);

	// 문제 유형에 맞는 DOM을 out_dom에 append한다.
	mocktest.quests.forEach(quest => {
		if(!quest)
			return;

		// Horizontal Line
		out_dom.appendChild(document.createElement('hr'));
		if(quest.type == 'binary')
			out_dom.appendChild(create_tfquest_dom(quest));
		else if(quest.type == 'selection' || quest.type == 'selection2')
			out_dom.appendChild(create_selection_dom(quest));
		else if(quest.type == 'short')
			out_dom.appendChild(create_short_dom(quest));
	});
}

// 참/거짓 문제 예제
document.getElementById('quest-0-bt').onclick = function() {
	if(!soup)
		return;

	// 문제 만들기
	let quest = Quest.generate_binary_quest(soup.roots[0]);

	// 지문 보여주기
	document.getElementById('quest-0-stmt').innerHTML = quest.statement;
	
	// 선택지와 답 보여주기
	document.getElementById('quest-0-choice-t').checked = (quest.answers[0] == 'T');
	document.getElementById('quest-0-choice-f').checked = (quest.answers[0] == 'F');
};

// n지선다 문제 예제
document.getElementById('quest-1-bt').onclick = function() {
	if(!soup)
		return;

	// 설정 값 읽기
	let n = parseInt(document.getElementById('quest-1-n').value);
	let a = parseInt(document.getElementById('quest-1-a').value);
	let inv = document.getElementById('quest-1-inv').checked;

	// 문제 만들기
	let material = Util.get_randomly(Soup.fetch_subinfos(soup.roots)
		.filter(info => { return info.attrs.length >= a; }));
	console.log(material);
	let quest = Quest.generate_selection_quest(material, n, a, inv);

	// 지문 보여주기
	document.getElementById('quest-1-stmt').innerHTML = quest.statement;
	
	// 선택지 보여주기
	document.getElementById('quest-1-sel').innerHTML = '';
	for(let i = 0; i < n; ++i) {
		document.getElementById('quest-1-sel').innerHTML +=
			`<input type='checkbox' id='quest-1-sel-${i}'>${quest.choices[i]}<br>`;
	}

	// 답 보여주기
	for(let i = 0; i < a; ++i) {
		document.getElementById(`quest-1-sel-${quest.answers[i]}`).checked = true;
	}
};

// 개별 문제 만들기
document.getElementById('quest-2-bt').onclick = function() {
	if(!soup)
		return;

	// 설정 값 읽기
	let n = parseInt(document.getElementById('quest-2-n').value);

	// 문제 만들기
	let quest = Quest.generate_short_quest(soup.roots[0], n);

	document.getElementById('quest-2-stmt').innerHTML = quest.statement;
	document.getElementById('quest-2-input').value = quest.answers.toString();
};

// 네트워크 테스트
// 참고
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
// https://stackoverflow.com/questions/24468459/sending-a-json-to-server-and-retrieving-a-json-in-return-without-jquery
document.getElementById('submit').onclick = function(evt) {
	// Soup 조리
	let docs_content = document.getElementById('docs').value;
	let cooked_soup = Parser.parse_doc(docs_content);
	let cooked_json = Protocol.create_message(cooked_soup, 'add');

	console.log(cooked_json);

	// URL 검증
	let url = document.getElementById('url').value;
	if(url.match(/http(s)?:/) == null)
		return;

	let xhr = new XMLHttpRequest();
	let monitor = document.getElementById('response');
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			monitor.value = '';
			monitor.value += '==== HEADER ====\n';
			monitor.value += xhr.getAllResponseHeaders();
			monitor.value += '\n==== RESPONSE ====\n';
			monitor.value += xhr.responseText;
		}
	};

	xhr.open('post', url, true);
	xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify(cooked_json));
};
},{"./src/mocktest":4,"./src/parser":5,"./src/protocol":6,"./src/quest":7,"./src/soup":9,"./src/util":10}],2:[function(require,module,exports){
const Util = {};

/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 임의의 정수를 반환한다.
*/
Util.random_int = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min + 0.5);
};

/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 중복되지 않는
	n개의 서로 다른 x를 만들어서 반환한다.
	O(max - min)의 공간복잡도와 시간복잡도가 발생한다.
*/
Util.random_choices = function(min, max, n) {
	min = Math.ceil(min);
	max = Math.floor(max);
	let N = max - min + 1;
	if(N < n) {
		throw new Error(`[random_choice] Cannot choose ${n} different numbers between ${min} ~ ${max}`);
	}

	// min ~ max까지의 숫자를 만든다
	let out = [];
	for(let i = 0; i < N; ++i)
		out[i] = min + i;

	// 적당히 섞는다.
	Util.shuffle(out);

	// n개만 반환한다.
	if(n == N)
		return out;
	else
		return out.slice(0, n);
};

/*
	arr를 무작위로 섞는다.
	outplace가 true이면 새 배열을 반환한다.
*/
Util.shuffle = function(arr, outplace) {
	if(outplace)
		arr = arr.slice();
	let temp, idx1, idx2;
	for(let i = 0; i < 4 * arr.length; ++i) {
		idx1 = Util.random_int(0, arr.length - 1);
		idx2 = Util.random_int(0, arr.length - 1);
		temp = arr[idx1];
		arr[idx1] = arr[idx2];
		arr[idx2] = temp;
	}
	return arr;
};

/*
	배열 arr에서 아무 원소나 반환한다.
	시간 복잡도가 O(1)이다
*/
Util.get_randomly = function(arr) {
	return arr[Util.random_int(0, arr.length - 1)];
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
	시간 복잡도가 O(n)이다
*/
Util.get_randomly_multi = function(arr, n) {
	return Util.random_choices(0, arr.length - 1, n).map(idx => {
		return arr[idx];
	});
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
	중복이 허용된다.
*/
Util.get_randomly_multi_dup = function(arr, n) {
	let out = [];
	for(let i = 0; i < n; ++i)
		out[i] = Util.get_randomly(arr);
	return out;
};

module.exports = Util;
},{}],3:[function(require,module,exports){
class Info {
	/*
		String[] names: 지식의 이름들, 반드시 1개 이상
		String[] attr: 지식의 속성들
	*/
	constructor(names, attrs) {
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array);

		this.names = names;
		this.attrs = attrs;
		this.comment = '';

		// parents 이 Info가 소속된 지식(들)을 레퍼런스로 저장한다.
		// childs는 이 Info가 가진 하위 지식(들)을 레퍼런스로 저장한다.
		this.parents = [];
		this.childs = [];

		// id는 DB에 지식이 처음으로 저장될 때 할당받는다.
		// 클라이언트에서 생성된 지식은 id를 갖지 않는다.
		this.id = null;

		// jsid는 클라이언트에서 임의의 두 지식을 식별하기 위한 값이다.
		// 이 값은 클라이언트가 실행된 이후로 Info가 생성된 순서와 같다.
		// 본래 id가 그 역할을 했으나, 몽고 DB에서의 고유키를 저장하는 것으로 바뀌면서
		// jsid가 탄생하였다. jsid의 유일성은 한 세션 내에서만 보장된다.
		this.jsid = Info.jsidcnt++;
		
		//this.ext = [];
	}

	toJSON() {
		return {
			names: this.names,
			attrs: this.attrs,
			comment: this.comment,
			id: this.id
		};
	}
}

Info.jsidcnt = 0;

module.exports = Info;
},{}],4:[function(require,module,exports){
const Info = require('./info');
const Soup = require('./soup');
const Quest = require('./quest');
const Util = require('./Util');

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
},{"./Util":2,"./info":3,"./quest":7,"./soup":9}],5:[function(require,module,exports){
const Info = require('./info');
const Soup = require('./soup');
const Parser = {};

// String docstr를 Soup로 반환한다.
Parser.parse_doc = function(docstr) {
	// pre-process
	let sentences = Parser.extract_sentences(docstr);
	let tokens = Parser.reorganize(Parser.tokenize(sentences));
	let soup = Parser.cook(tokens);
	return soup;
};

// 선두 공백문자(leading space)의 끝지점을 찾아 반환한다.
// ex: '  1234' -> 2
Parser.index_of_first_nonspace = function(target) {
	let result = target.match(/^( |'\t')*/);
	if(result)
		return result[0].length;
	else
		return 0;
};

// docstr에서 <문장>을 추출하여 String[]로 반환한다.
Parser.extract_sentences = function(docstr) {
	return docstr.split('\n')
	.map(s => {
	// 문장 앞에 나오는 공백을 제거한다.
	// 제거할 필요가 없을 땐 복사를 막기 위해 원본을 반환한다.
		let sidx = Parser.index_of_first_nonspace(s);
		if(sidx == 0)
			return s;
		else
			return s.slice(sidx);
	}).filter(s => {
	// 공백 제거 후 내용이 없는 문장은 삭제한다.
		return s != '';
	});
};

// sentences 배열의 원소들을 다음과 같이 가공하여 배열로 반환한다.
// 	[식별 기호가 제외된 문장, 토큰 분류]
//
// 원소가 <제목n식별자>인 경우, 마지막에 추가로 n을 적어준다.
// ex: '#### 4개짜리' -> ['4개짜리', '<제목n>', 4]
//
// 식별 기호를 제거했을 때 내용이 없는 토큰은 삭제한다.
// ex: '* ' -> 삭제
Parser.tokenize = function(sentences) {
	return sentences.map(s => {
		let match_info = null;
		if(match_info = s.match(/#+ /)) {
		// <제목n식별자>
			return [s.slice(match_info[0].length), '<제목n>',
				match_info[0].length - 1];
		} else if(match_info = s.match(/\- /)) {
		// <속성>
			return [s.slice(match_info[0].length), '<속성>'];
		} else {
		// <소주석>
			return [s, '<주석>'];
		}
	}).filter(token => {
		return token[0] != '';
	});
};

// 토큰열을 제목 서브토큰 주석 속성 순으로 만들어준다.
Parser.reorganize = function(tokens) {
	let stack = [];
	for(let i = tokens.length - 1; i >= 0; --i) {
		// 문서 상에서는 <소주석>과 <주석>을 이론적으로 구분하지만
		// 실제 코딩을 할 때는 구분이 필요없다.
		if(tokens[i][1] == '<주석>') {
			// 최초의 주석은 무시
			if(i == 0)
				break;

			if(tokens[i - 1][1] == '<주석>') {
			// 주석이 연달아 나오면 합친다.
				let merged = [];
				merged[0] = tokens[i - 1][0] + '\n' + tokens[i][0];
				merged[1] = '<주석>';
				tokens[i - 1] = merged;
			}
			else if(tokens[i - 1][1] == '<속성>') {
			// 속성이 앞에 있으면 자리를 바꾼다.
				let temp = tokens[i];
				tokens[i] = tokens[i - 1];
				tokens[i - 1] = temp;
				stack.push(tokens[i]);
			} 
			else {
			// 일반적인 주석이다.
				stack.push(tokens[i]);
			}
		} else {
			stack.push(tokens[i]);
		}
	}
	return stack.reverse();
};

// 토큰을 분석하여 수프를 만들어 Soup로 반환한다.
// Soup.roots에 루트가 있다.
Parser.cook = function(tokens) {
	// 에러
	if(tokens == null)
		throw new Error('[parser::cook] null pointer exception');

	// 지저분한 예외
	if(tokens.length == 0)
		return [];

	// 전체가 예쁜 루트로 묶여있으면 참 좋은데
	// 사용자들이 그렇게 예쁘게 적어줄 리가 없다.
	//
	// 한 과목 내에 여러 문서 파일이 존재할 수가 있으며
	// 문서마다 임의로 주제를 만들어 묶을 경우, 무의미한 주제가 생긴다.
	//
	// 그래서 포레스트로 인정을 하며, 그걸 어떻게 다룰지는
	// cook을 호출한 곳의 상황에 따라 결정하록 한다
	let soup = new Soup();
	let spos = 0;
	let epos = 1;
	let level = tokens[0][2];
	while(epos <= tokens.length) {
		if(epos == tokens.length) {
		// 맨 마지막 경우
			let temp = Parser.assemble(soup, tokens, spos, epos);
			// if(temp)
			// 	soup.roots.push(temp);
			spos = epos;
		}
		else if(tokens[epos][1] == '<제목n>' && tokens[epos][2] <= level) {
		// 현재 토큰의 뎁스보다 더 깊은 녀석은 자식이다
			level = tokens[epos][2];
			let temp = Parser.assemble(soup, tokens, spos, epos);
			// if(temp)
			// 	soup.roots.push(temp);
			spos = epos;
		}
		++epos;
	}
	return soup;
};

// 전제조건: tokens[spos]는 반드시 <제목n>이어야 하며
// [spos, epos) 구간의 제목 단계는 n보다 커야한다.
Parser.assemble = function(soup, tokens, spos, epos) {
	let out = soup.create_info([tokens[spos][0]], []);
	++spos;
	while(spos < epos) {
		if(tokens[spos][1] == '<주석>') {
		// 현재 토큰이 <주석>이면 현재 주제에 추가
			out.comment = tokens[spos][0];
			++spos;
		}
		else if(tokens[spos][1] == '<속성>') {
		// 현재 토큰이 <속성>이면 나중에 같은 이름의 지식 만듦
			out.attrs.push(tokens[spos][0]);
			++spos;
		}
		else if(tokens[spos][1] == '<제목n>') {
		// 현재 토큰이 <제목n>이면 자식을 만듦
			do {
				let idx = spos + 1;
				while(idx < tokens.length && 
					!(tokens[idx][1] == '<제목n>'
						&& tokens[idx][2] <= tokens[spos][2])) {
					++idx;
				}
				let temp = Parser.assemble(soup, tokens, spos, idx);
				if(temp)
					soup.append(out, temp);
				spos = idx;
			}
			while(spos < epos);
		}
	}

	if(out.attrs.length > 0 || out.childs.length > 0) {
		return out;
	}
	else {
	// 속성도 없고 자식주제도 없으면 무의미하므로 제거
		return null;
	}
};

/*
	이 코드의 내용은 abstraction.md를 잘 읽고 건드려야 한다.
*/
module.exports = Parser;
},{"./info":3,"./soup":9}],6:[function(require,module,exports){
const Info = require('./info');
const Soup = require('./soup');

const Protocol = {
	// info의 하위지식을 comm에 직렬화한다.
	__pack(info, comm) {
		comm.idxmap[info.jsid] = comm.cnt++;
		comm.out.infos.push(info.toJSON());
		info.childs.forEach(child => {
			if(comm.idxmap[child.jsid] === undefined)
				Protocol.__pack(child, comm);
			comm.out.connections.push([
				comm.idxmap[info.jsid],
				comm.idxmap[child.jsid]
			]);
		});
	},

	// Info[] roots를 최상위 지식으로 삼는 스프를
	// TopologyMessage로 만들어 반환한다.
	// TopologyMessage의 형식은 다음과 같다.
	// {
	//		infos: [], connections: [], type: some string
	// }
	create_message(soup, type) {
		let comm = {
			idxmap: {},
			cnt: 0,
			out: {
				infos: [],
				connections: [],
				type
			}
		};
		soup.roots.forEach(root => {
			if(comm.idxmap[root.jsid] === undefined)
				Protocol.__pack(root, comm);
		});
		return comm.out;
	},

	/*
		TopologyMessage msg를 다시 Soup로 반환한다.
		서버에서 들어온 것을 조립해준다.
	*/
	parse_message(msg) {
		let soup = new Soup();
		msg.infos.forEach(pre_info => {
			soup.create_info(pre_info.names, pre_info.attrs).
				comment = pre_info.comment;
		});

		// Topology Reset
		msg.connections.forEach(pair => {
			soup.append(soup.infos[pair[0]], soup.infos[pair[1]]);
		});

		return soup;
	}
};

module.exports = Protocol;
},{"./info":3,"./soup":9}],7:[function(require,module,exports){
const Info = require('./info');
const Soup = require('./soup');
const Util = require('./util');
const Queue = require('./queue');

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

	6. n지선다 문제 Attr to Name형
	Quest Quest.generate_selection2_quest(Info g, int n, int a)
		n: 선택지 수
		a: 골라야 하는 답의 수

	이 이외의 함수는 건드렸을 때 책임 안짐
*/

class Quest {
	/*
		type은 {'binary', 'selection', 'short'} 중 하나일 것
	*/
	constructor(type, title, statement, choices, answers, materials) {
		console.assert(type);
		console.assert(title);
		console.assert(Array.isArray(choices));
		console.assert(Array.isArray(answers));
		if(!Array.isArray(answers)) {
			console.log('babo');
			console.log(answers);
		}
		this.type = type;
		this.title = title;
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
	return new Quest('binary', '다음 문장의 참/거짓을 판별하시오.',
		`${material.names[0]}은(는) ${fact}`,
		['T', 'F'], [ans], material);
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
		null, choices, answers, material);
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
	let title = '다음이 설명하는 것을 적으시오.';
	let stmt = '';
	attrs.forEach(attr => {
		stmt += '\n * ' + attr;
	});
	return new Quest('short', title, stmt, [], material.names, material);
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

// n지선다 유형 II 문제 생성
// 속성을 주고 이름을 고르는 것
// material은 반드시 root가 아니어야 한다. root면 무조건 에러난다.
// 문제 생성에 실패할 경우 에러가 발생한다.
//
// 그래프에 n개 이상의 지식이 존재해야 한다.
// material: 문제를 출제할 지식
// n: 선택지의 수
Quest.generate_selection2_quest = function(material, n) {
	// 다른 지식의 이름을 가져올 범위를 찾는다.
	let g = material;
	let q = new Queue();

	// 정답 선택지 만들기
	let pos = material;

	let title = '다음이 설명하는 것으로 알맞은 것을 고르시오.';
	let stmt = '';
	pos.attrs.forEach(attr => {
		stmt += '\n * ' + attr;
	});

	// 오답 선택지 찾기
	// 자기 자식을 전부 discard 시키기
	let history = {};
	let neg_infos = [];
	Soup.for_each_childs_pre([material], root => {
		history[root.jsid] = 1;
	});
	material.parents.forEach(parent => {
		q.push(parent);
	});
	while(!q.empty() && neg_infos.length < n - 1) {
		// 부모를 뽑아서 그 자식들을 neg_infos에 집어넣는다.
		let current = q.pop();
		if(history[current.jsid])
			continue;
		history[current.jsid] = 1;

		// for every child except history[id] > 0
		current.childs.forEach(child => {
			if(history[child.jsid])
				return;
			if(neg_infos.length >= n - 1)
				return;
			neg_infos.push(child);
			q.push(child);
		})
		if(neg_infos.length >= n - 1)
			break;
		current.parents.forEach(parent => {
			if(history[parent.jsid])
				return;
			q.push(parent);
		});
	}
	if(neg_infos.length < n - 1)
		throw new Error('[Quest::generate_selection2_quest] Fail to make quest as there are not enough infos');

	// 선택지 합치기
	neg_infos.push(pos)
	Util.shuffle(neg_infos, false);
	let choices = neg_infos.map(info => {
		return Util.get_randomly(info.names);
	});
	let answers = [`${neg_infos.indexOf(material)}`];

	// 표현
	return new Quest('selection2', title, stmt, choices, answers, material);
};

module.exports = Quest;
},{"./info":3,"./queue":8,"./soup":9,"./util":10}],8:[function(require,module,exports){
class Queue {
	constructor() {
		this.first = null;
		this.last = null;
		this.size = 0;
	}

	push(value) {
		if(this.first == null) {
			this.first = this.last = {
				value,
				next: null
			};
		}
		else {
			this.last = this.last.next = {
				value,
				next: null
			};
		}
		++this.size;
		return value;
	}

	pop() {
		if(!this.first)
			return null;
		let out = this.first.value;
		this.first = this.first.next;
		if(this.first == null)
			this.last = null;
		--this.size;
		return out;
	}

	front() {
		if(this.empty())
			return null;
		return this.first.value;
	}

	back() {
		if(this.empty())
			return null;
		return this.last.value;
	}

	empty() {
		return this.first == null;
	}
};

module.exports = Queue;
},{}],9:[function(require,module,exports){
const Info = require('./info');
const Util = require('./util');

/*
	Soup를 Parser.parse_doc으로 얻어낸 이후
	Invariant를 만족하는지 확인하려면 다음과 같이 짜시오.

	(4지1답만 만들 경우)

	let soup = Parser.parse_doc(MD문자열)
	let issues = soup.validation_check({n: 4, a: 1})
	issues.forEach(issue => {
		// 문제점이 있는 info임
		// null이라면, 개별 info의 문제보다 스프 전체의 문제인 경우
		let info = issue.info;
		
		// what에 문제점을 문자열로 기록.
		alert(issue.what);
	})
*/
class Soup {
	constructor() {
		this.infos = [];
		this.roots = [];
	}

	create_info(names, attrs) {
		let temp = new Info(names, attrs);
		this.infos.push(temp);
		this.roots.push(temp);
		return temp;
	}

	// parent에 child를 직속주제 또는 직속지식으로 추가하고
	// true를 반환한다. 이미 소속이 돼 있는 경우 false를
	// 반환한다.
	append(parent, child) {
		console.assert(parent instanceof Info);
		console.assert(child instanceof Info);
		// 상위 주제가 이 지식을 이미 포함하고 있는지 확인한다.
		if(parent.childs.indexOf(child) != -1)
			return false;

		parent.childs.push(child);
		child.parents.push(parent);

		// remove
		let cidx = this.roots.indexOf(child);
		if(cidx >= 0) {
			this.roots = this.roots.slice(0, cidx)
				.concat(this.roots.slice(cidx + 1));
		}
		return true;
	}

	/*
		이 Soup의 상태를 보여줄 수 있는 트리를 텍스트로 그린다.
		이 함수의 외부에서 사용 시 인자는 없다.

		원래 Soup는 DAG이지 Tree는 아니다.
		하지만 직관적으로 확인하기 위해 Tree로 간주하고 그린다.
	*/
	get_tree() {
		return this._getTreeText(this.infos[0], '', '');
	}

	_getTreeText(info, out, tab) {
		out += `${tab}info[${info.id}] ${info.names[0]}\n`;
		tab += '. . ';
		info.attrs.forEach(attr => {
			out += `${tab} * ${attr}\n`;
		});
		info.childs.forEach(child => {
			out = this._getTreeText(child, out, tab);
		});
		return out;
	}

	validation_check(numargs) {
		let n = numargs.n;
		let a = numargs.a;
		console.assert(n !== undefined);
		console.assert(a !== undefined);
		let p = Math.max(n - a, a);

		let issues = [];
		let dup = {};
		function _attr_check(node, dup, issues) {
			// 중복방지
			if(dup[node.jsid])
				return;
			dup[node.jsid] = true;

			// 검사
			if(node.attrs.length > 0 && node.attrs.length < p)
				issues.push({
					info: node,
					what: `${node.names[0]}의 속성이 너무 적습니다(${node.attrs.length}개). ${p}개 이상이어야 문제를 만들 수 있습니다.`
				});

			node.childs.forEach(child => _attr_check(child, dup, issues));
		}
		this.roots.forEach(root => _attr_check(root, dup, issues));
		return issues;
	}
}

// 지식 g들로부터 도달할 수 있는 모든 지식을 반환한다.
Soup.fetch_subinfos = function(gs) {
	function __fetch_subinfos(info, out, dup) {
		info.childs.forEach(child => {
			if(!dup[child.jsid]) {
				out.push(child);
				dup[child.jsid] = true;
				__fetch_subinfos(child, out, dup);
			}
		});
		return out;
	}

	let dup = {};
	let out = [];
	gs.forEach(g => __fetch_subinfos(g, out, dup));
	return out;
};

// 지식들 infos에 존재하는 모든 속성의 수를 구한다.
// DFS를 돌리므로 주의해서 사용해야 한다.
Soup.total_attrs_count = function(infos) {
	let cnt = 0;
	function __total_attrs_count(info, dup) {
		cnt += info.attrs.length;
		info.childs.forEach(child => {
			if(!dup[child.jsid]) {
				dup[child.jsid] = true;
				__total_attrs_count(child, dup);
			}
		});
	}
	let dup = {};
	infos.forEach(info => __total_attrs_count(info, dup));
	return cnt;
};

// 지식 material에서 임의의 속성을 선택한다.
Soup.select_positive_attr = function(material) {
	return Util.get_randomly(material.attrs);
};

// 지식 material에서 겹치지않는 n개의 임의의 속성들을 선택한다
Soup.select_positive_attrs = function(material, n) {
	return Util.get_randomly_multi(material.attrs, n);
};

// 지식 material의 속성과 반하는 속성 또는 무관한 속성을 반환한다.
//
// 현재는 material에 대하여 명제가 충돌하는지 검사할 방법이 없으므로
// 그냥 아무거나 잡는다.
Soup.select_negative_attrs = function(root, material, n) {
	console.assert(root instanceof Info);
	console.assert(material instanceof Info);
	console.assert(typeof(n) == 'number');

	// 클로저
	// let check = new Map();
	// let refs = new Map();

	// // 내부 함수 원리는 select_negative_attr.md 참고 바람
	// // Info root
	// function discard_subinfos(root) {
	// 	check.set(root.jsid, Soup.TYPE_I);
	// 	root.childs.forEach(child => {
	// 		let ctype = check.get(child.jsid);
	// 		if(ctype === undefined || ctype == Soup.TYPE_O)
	// 			discard_subinfos(child);
	// 	});
	// }

	// // Info root 		출제범위 상한선
	// // Info material 	출제주제
	// // 반환값은 root가 material로 가는 경로를 가진 경우 TYPE_M
	// // 그렇지 않은 경우 TYPE_O
	// function traverse_down(root, material) {
	// 	if(root == material) {
	// 		discard_subinfos(material);
	// 		check.set(root.jsid, Soup.TYPE_M);
	// 		return Soup.TYPE_M;
	// 	}
	// 	else {
	// 		let rtype = Soup.TYPE_O;
	// 		root.childs.forEach(child => {
	// 			let ctype = check.get(child.jsid);
	// 			if(ctype === undefined)
	// 				ctype = traverse_down(child, material);
	// 			if(ctype == Soup.TYPE_M)
	// 				rtype = Soup.TYPE_M;
	// 		});
	// 		check.set(root.jsid, rtype);

	// 		// 알고리즘 특성상 jsid를 키로 갖는 map을 순환
	// 		// 해야하는데, 어차피 반환하지도 않을 TYPE_M이나
	// 		// TYPE_I는 굳이 저장할 필요가 없으므로 재낀다
	// 		if(rtype == Soup.TYPE_O)
	// 			refs.set(root.jsid, root);
	// 		return rtype;
	// 	}
	// }

	// // 정말로 사용할 수 있는 애들만 추림
	// // refs에는 과거에 TYPE_O였지만 나중에 TYPE_M으로 바뀐
	// // 것들이 존재할 수 있기 때문에 마지막 체크를 한 번 더 해
	// // 줘야함
	// let out = [];
	// traverse_down(root, material);
	// refs.forEach((val, key) => {
	// 	if(check.get(key) == Soup.TYPE_O)
	// 		out.push(val);
	// });
	let out = Soup.select_negative_infos(root, material, n);

	// 1개짜리와 n개짜리를 처리하는데 복잡도가 달라지기 때문에
	// 특별히 구분해준다.
	// Util.get_randomly의 반환형은 배열이 아니기 때문에
	// 호환성을 위해 배열로 만들어준다.
	if(n == 1) {
		return [Util.get_randomly(out.reduce((accm, info) => {
			// if(is_subject_to(info, material))
			// 	return accm.concat(info.attrs);
			// else
			// 	return accm;
			return accm.concat(info.attrs);
		}, []))];
	}
	else {
		return Util.get_randomly_multi(out.reduce((accm, info) => {
			// if(is_subject_to(info, material))
			// 	return accm.concat(info.attrs);
			// else
			// 	return accm;
			return accm.concat(info.attrs);
		}, []), n);
	}
};

Soup.select_negative_infos = function(root, material, n) {
	console.assert(root instanceof Info);
	console.assert(material instanceof Info);
	console.assert(typeof(n) == 'number');

	// 클로저
	let check = new Map();
	let refs = new Map();

	// 내부 함수 원리는 select_negative_attr.md 참고 바람
	// Info root
	function discard_subinfos(root) {
		check.set(root.jsid, Soup.TYPE_I);
		root.childs.forEach(child => {
			let ctype = check.get(child.jsid);
			if(ctype === undefined || ctype == Soup.TYPE_O)
				discard_subinfos(child);
		});
	}

	// Info root 		출제범위 상한선
	// Info material 	출제주제
	// 반환값은 root가 material로 가는 경로를 가진 경우 TYPE_M
	// 그렇지 않은 경우 TYPE_O
	function traverse_down(root, material) {
		if(root == material) {
			discard_subinfos(material);
			check.set(root.jsid, Soup.TYPE_M);
			return Soup.TYPE_M;
		}
		else {
			let rtype = Soup.TYPE_O;
			root.childs.forEach(child => {
				let ctype = check.get(child.jsid);
				if(ctype === undefined)
					ctype = traverse_down(child, material);
				if(ctype == Soup.TYPE_M)
					rtype = Soup.TYPE_M;
			});
			check.set(root.jsid, rtype);

			// 알고리즘 특성상 jsid를 키로 갖는 map을 순환
			// 해야하는데, 어차피 반환하지도 않을 TYPE_M이나
			// TYPE_I는 굳이 저장할 필요가 없으므로 재낀다
			if(rtype == Soup.TYPE_O)
				refs.set(root.jsid, root);
			return rtype;
		}
	}

	// 정말로 사용할 수 있는 애들만 추림
	// refs에는 과거에 TYPE_O였지만 나중에 TYPE_M으로 바뀐
	// 것들이 존재할 수 있기 때문에 마지막 체크를 한 번 더 해
	// 줘야함
	let out = [];
	traverse_down(root, material);
	refs.forEach((val, key) => {
		if(check.get(key) == Soup.TYPE_O)
			out.push(val);
	});

	return out;
};

/**
	전위탐색으로 roots의 자식들을 탐색한다.
	같은 root는 root.childs에 적재된 순서대로 탐색한다.

	consummer는 해당 root와 공통인 comm이 있다.
	comm.visited[jsid]로 방문 여부를 확인할 수 있다.

	visited = 1이면 방문을 한 상태
	visited = 2이면 탐색이 끝난 상태
*/
Soup.for_each_childs_pre = function(roots, consummer) {
	let comm = {
		visited: {}
	};
	function _for_each_childs(root, comm) {
		if(comm.visited[root.jsid])
			return;
		comm.visited[root.jsid] = 1;
		consummer(root, comm);
		root.childs.forEach(child => {
			_for_each_childs(child, comm);
		});
		comm.visited[root.jsid] = 2;
	}
	roots.forEach(root => {
		_for_each_childs(root, comm);
	});
}

Soup.TYPE_I = 1;
Soup.TYPE_M = 2;
Soup.TYPE_O = 3;

// select_negative_attr의 복수버전
// Soup.select_negative_attrs = function(material, subinfos, n) {
// 	return Util.get_randomly_multi(subinfos.reduce((accm, info) => {
// 		if(info == material)
// 			return accm;
// 		else
// 			return accm.concat(info.attrs);
// 		// else if(is_subject_to(info, material))
// 		// 	return accm.concat(info.attrs);
// 		// else
// 		// 	return accm;
// 	}, []), n);
// };

module.exports = Soup;
},{"./info":3,"./util":10}],10:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}]},{},[1]);
