let soup = new Soup();
let root = null;

// 파싱 예제
function debug_parse_doc(docstr) {
	// for debug purpose
	let dom = document.querySelector('#tree');
	dom.value = '';
	root = parse_doc(docstr)[0];
	dom.value = soup.get_tree();
}

// 참/거짓 문제 예제
document.getElementById('quest-0-bt').onclick = function() {
	if(!root)
		return;

	// 문제 만들기
	let quest = Quest.generate_binary_quest(root);

	// 지문 보여주기
	document.getElementById('quest-0-stmt').innerHTML = quest.statement;
	
	// 선택지와 답 보여주기
	document.getElementById('quest-0-choice-t').checked = (quest.answers[0] == 'T');
	document.getElementById('quest-0-choice-f').checked = (quest.answers[0] == 'F');
};

// n지선다 문제 예제
document.getElementById('quest-1-bt').onclick = function() {
	if(!root)
		return;

	// 설정 값 읽기
	let n = parseInt(document.getElementById('quest-1-n').value);
	let a = parseInt(document.getElementById('quest-1-a').value);
	let inv = document.getElementById('quest-1-inv').checked;

	// 문제 만들기
	let quest = Quest.generate_selection_quest(root, n, a, inv);

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
	if(!root)
		return;

	// 설정 값 읽기
	let n = parseInt(document.getElementById('quest-2-n').value);

	// 문제 만들기
	let quest = Quest.generate_short_quest(root, n);

	document.getElementById('quest-2-stmt').innerHTML = quest.statement;
	document.getElementById('quest-2-input').value = quest.answers.toString();
};