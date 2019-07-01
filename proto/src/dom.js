function update_group_tree(dbproto) {
	document.getElementById('group_tree').innerText =
		dbproto.getTreeText();
}

/*
	현재 문서에서 주제를 읽어 [[이름], [parent_name1, parent_name2, ...]]
	로 반환한다.
*/
function get_group() {
	let group_name_dom = document.getElementById('group_name');
	let group_parents_dom = document.getElementById('group_parents');
	return [group_name_dom.value, group_parents_dom.value.split('\n')];
}

function set_info_dom(info) {
	let info_name_dom = document.getElementById('info_names');
	info.names.forEach(name => {
		info_name_dom.value += name + '\n';
	});
	let info_attr_dom = document.getElementById('info_attrs');
	info.attrs.forEach(attr => {
		info_attr_dom.value += attr + '\n';
	});
	let info_group_dom = document.getElementById('info_group');
	info.groups.forEach(group => {
		info_group_dom.value += group + '\n';
	});
}

/*
	현재 문서에 사용자가 입력한 주제를 읽어
	[[이름들], [속성들], [주제이름들]]로 반환한다.

	모두 개행문자로 구분하여 자른다.
*/
function get_info() {
	let info_name_dom = document.getElementById('info_names');
	let info_attr_dom = document.getElementById('info_attrs');
	let info_group_dom = document.getElementById('info_group')
	return [
		info_name_dom.value.split('\n'),
		info_attr_dom.value.split('\n'), 
		info_group_dom.value.split('\n')];
}

/*
	현재 문제를 HTML 페이지에 보여준다.

	String facts
		지문에 해당하는 것. 개행문자를 포함할 수 있다.
	String[] choices
		선택지에 해당하는 것.
*/
function set_quest_dom(facts, choices) {
	console.assert(typeof(facts) == 'string');
	console.assert(choices instanceof Array && choices.length >= 4);
	document.getElementById('quest_facts').innerText = facts;
	let dom_labels = document.getElementsByName('quest_choice_label');
	for(let i = 0; i < 4; ++i)
		dom_labels[i].innerText = choices[i][0];
}

/*
	선택된 선택지를 읽어와 number로 반환한다.
*/
function get_choice() {
	return parseInt(document.querySelector('input[name="quest_choie"]:checked').value);
}