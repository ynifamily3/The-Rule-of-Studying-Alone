(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Parser = require('./src/parser');
const Quest = require('./src/quest');
const Protocol = require('./src/protocol');

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
	let quest = Quest.generate_selection_quest(soup.roots[0], n, a, inv);

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
	if(url.match(/http:/) == null)
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
},{"./src/parser":3,"./src/protocol":4,"./src/quest":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
		} else if(match_info = s.match(/\* /)) {
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
			if(temp)
				soup.roots.push(temp);
			spos = epos;
		}
		else if(tokens[epos][1] == '<제목n>' && tokens[epos][2] <= level) {
		// 현재 토큰의 뎁스보다 더 깊은 녀석은 자식이다
			level = tokens[epos][2];
			let temp = Parser.assemble(soup, tokens, spos, epos);
			if(temp)
				soup.roots.push(temp);
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
},{"./info":2,"./soup":6}],4:[function(require,module,exports){
const Info = require('./info');

const Protocol = {
	// info의 하위지식을 comm에 직렬화한다.
	__pack(info, comm) {
		comm.idxmap[info.jsid] = comm.cnt++;
		comm.out.infos.push(info.toJSON());
		info.childs.forEach(child => {
			if(comm.idxmap[child.jsid] === undefined)
				Protocol.__pack(child, comm);
			if(comm.out.type == 'add') {
				comm.out.connections.push([
					comm.idxmap[info.jsid],
					comm.idxmap[child.jsid]
				]);
			}
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
	}
};

module.exports = Protocol;
},{"./info":2}],5:[function(require,module,exports){
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
	constructor(type, statement, choices, answers) {
		console.assert(type);
		console.assert(statement);
		console.assert(choices instanceof Array);
		console.assert(answers instanceof Array);
		this.type = type;
		this.statement = statement;
		this.choices = choices;
		this.answers = answers;
	}
}

Quest.evaluate = function(quest, response) {
	return Quest.evaluator[quest.type](quest, response);
};

Quest.evaluator = {};

// 참/거짓 유형 문제 생성
Quest.generate_binary_quest = function(g) {
	let subinfos = Soup.fetch_subinfos(g).filter(info => {
		return info.attrs.length > 0;
	});
	let material = Util.get_randomly(subinfos);
	let ans = null;
	let fact = null;
	if(Math.random() > 0.5) {
		ans = 'T';
		fact = Soup.select_positive_attr(material);
	}
	else {
		ans = 'F';
		//if(Math.random() > 0.5)
		// 	fact = Soup.select_negative_attr(material);
		// else
		// 	fact = Soup.mutate_attr(Soup.select_positive_attr(material));
		fact = Soup.select_negative_attr(material, subinfos);
	}
	let name = Util.get_randomly(material.names);
	return new Quest('binary', `다음 문장의 참/거짓을 판별하시오.<br>`
		+`${material.names[0]}은(는) ${fact}`
		,['T', 'F'], [ans]);
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
// g: 문제를 출제할 지식
// n: 선택지의 수
// a: 정답의 수
// inv: 옳은/옳지 않은
Quest.generate_selection_quest = function(g, n, a, inv) {
	let p = inv ? n - a : a;
	let subinfos = Soup.fetch_subinfos(g);
	let material = Util.get_randomly(subinfos.filter(info => {
		return info.attrs.length >= p;
	}));

	// 정답 선택지 만들기
	let pos = Soup.select_positive_attrs(material, p);

	// 오답 선택지 만들기
	let neg = Soup.select_negative_attrs(material, subinfos, n - p);

	// 선택지 합치기
	let choices = Util.shuffle(pos.concat(neg), false);
	let answers = null;
	if(inv)
		answers = neg.map(attr => {
			return choices.indexOf(attr);
		});
	else
		answers = pos.map(attr => {
			return choices.indexOf(attr);
		});
	let name = Util.get_randomly(material.names);

	// 표현
	let logic_label = inv ? '옳지 않은 것' : '옳은 것';
	return new Quest('selection', 
		`다음 중 ${name}에 대한 설명으로 ${logic_label}을 고르시오.`,
		choices, answers);
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
Quest.generate_short_quest = function(g, n) {
	let material = Util.get_randomly(Soup.fetch_subinfos(g).filter(info => {
		return info.attrs.length > 0;
	}));

	// 속성이 n개보다 적을 경우, n을 조절해줘서 util.js가
	// 뻑나지 않도록 한다.
	if(material.attrs.length < n)
		n = material.attrs.length;
	let attrs = Soup.select_positive_attrs(material, n);
	let stmt = '다음이 설명하는 것을 적으시오.<br>';
	attrs.forEach(attr => {
		stmt += ' * ' + attr + '<br>';
	});
	return new Quest('short', stmt, [], material.names);
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
},{"./info":2,"./soup":6,"./util":7}],6:[function(require,module,exports){
const Info = require('./info');
const Util = require('./util');

class Soup {
	constructor() {
		this.infos = [];
		this.roots = [];
	}

	create_info(names, attrs) {
		let temp = new Info(names, attrs);
		this.infos.push(temp);
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
}

// 지식 g로부터 도달할 수 있는 모든 지식을 반환한다.
Soup.fetch_subinfos = function(g) {
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
	return __fetch_subinfos(g, [], {});
};

// 지식 material에서 임의의 속성을 선택한다.
Soup.select_positive_attr = function(material) {
	return Util.get_randomly(material.attrs);
};

// 지식 material에서 겹치지않는 n개의 임의의 속성들을 선택한다
Soup.select_positive_attrs = function(material, n) {
	return Util.get_randomly_multi(material.attrs, n);
};

// 지식들 subinfos에서 지식 material과 충돌하지 않는 속성을 선택한다.
// 원래 문서에는 매번 subinfos를 구하지만 이는 비효율적이므로, 외부에서
// 사전에 구하도록 한다. 
//
// 현재는 material에 대하여 명제가 충돌하는지 검사할 방법이 없으므로
// 그냥 아무거나 잡는다.
Soup.select_negative_attr = function(material, subinfos) {
	return Util.get_randomly(subinfos.reduce((accm, info) => {
		if(info == material)
			return accm;
		else
			return accm.concat(info.attrs);
		// else if(is_subject_to(info, material))
		// 	return accm.concat(info.attrs);
		// else
		// 	return accm;
	}, []));
};

// select_negative_attr의 복수버전
Soup.select_negative_attrs = function(material, subinfos, n) {
	return Util.get_randomly_multi(subinfos.reduce((accm, info) => {
		if(info == material)
			return accm;
		else
			return accm.concat(info.attrs);
		// else if(is_subject_to(info, material))
		// 	return accm.concat(info.attrs);
		// else
		// 	return accm;
	}, []), n);
};

module.exports = Soup;
},{"./info":2,"./util":7}],7:[function(require,module,exports){
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
	for(let i = 0; i < arr.length; ++i) {
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
*/
Util.get_randomly = function(arr) {
	return arr[Util.random_int(0, arr.length - 1)];
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
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
},{}]},{},[1]);
