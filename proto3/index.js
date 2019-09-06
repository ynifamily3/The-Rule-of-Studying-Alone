const Soup = require('./src/soup');
const Parser = require('./src/parser');
const Quest = require('./src/quest');
const Protocol = require('./src/protocol');
const Mocktest = require('./src/mocktest');

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

// 모의고사 생성!
document.getElementById('mocktest').onclick = function() {
	if(!soup)
		return;

	let n = parseInt(document.getElementById('mocktest-n').value);
	let out_dom = document.getElementById('mocktest-out');
	let subinfos = Soup.fetch_subinfos([soup.roots[0]]);
	let domains = Mocktest.distribute(subinfos, n);
	console.log(domains);
	out_dom.innerText = '';
	domains.forEach(info => {
		out_dom.innerText += `${info.names[0]}\n`;
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