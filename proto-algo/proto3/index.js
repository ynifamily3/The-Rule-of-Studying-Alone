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
	stmt.innerText = quest.statement;
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
	stmt.innerText = quest.statement;
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
	stmt.innerText = quest.statement;
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