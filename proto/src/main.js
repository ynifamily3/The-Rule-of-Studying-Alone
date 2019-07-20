let dbproto = null;

function submit_group() {
	// 이미 존재하는 그룹인지 확인
	let temp = get_group();
	let g = dbproto.searchGroup(temp[0]);
	if(g == null)
		g = dbproto.createGroup(temp[0]);

	// 상위주제가 있는 경우
	if(temp[1][0]) {
		// 모든 입력된 상위 주제가 존재하는지 확인
		let valid = true;
		temp[1].forEach(pname => {
			if(dbproto.searchGroup(pname) == null) {
				alert('주제 "' + pname + '"는 존재하지 않습니다.');
				valid = false;
			}
		});
		if(!valid)
			return;

		temp[1].forEach(pname => {
			dbproto.connectGroup(g, pname);
		});	
	} else {
		dbproto.connectGroup(g, '__ROOT__');
	}
	update_group_tree(dbproto);
}

function submit_info() {
	let temp = get_info();
	if(temp[2][0]) {
		// 모든 입력된 상위 주제가 존재하는지 확인
		let valid = true;
		temp[2].forEach(gname => {
			if(dbproto.searchGroup(gname) == null) {
				alert('주제 "' + gname + '"는 존재하지 않습니다.');
				valid = false;
			}
		});
		if(!valid)
			return;

		// 실제로 등록
		let info = dbproto.createInfo(temp[0], temp[1]);
		temp[2].forEach(gname => {
			dbproto.connectInfo(info, gname);
		});
		update_group_tree(dbproto);
	} else {
		alert('지식은 반드시 소속주제를 가져야 합니다.');
	}
}

function create_quest() {
	let group_name = document.getElementById('quest_group').value;
	if(group_name) {
		// 주제가 존재하는지 확인
		let g = dbproto.searchGroup(group_name);
		if(g == null) {
			alert('주제 "' + groupe_name + '"는 존재하지 않습니다.');	
			return;
		}

		let cqg = new ChoiceQuestGenerator(4, 1, false);
		let q = cqg.createQuest(g);
		set_quest_dom(q.question, q.choices);
	} else {
		alert('문제를 만들 주제를 골라주세요.');
	}
}

(async function() {
	dbproto = new DBProto();
	await dbproto.load();

	document.getElementById('submit_group').onclick = submit_group;
	document.getElementById('submit_info').onclick = submit_info;
	document.getElementById('quest_make').onclick = create_quest;

	set_quest_dom('다음 중 오늘 먹을 음식으로 알맞은 것을 고르시오.',
		['기숙사 식당', '머윤파닭', '뒷통구이', '댕댕이']);

	update_group_tree(dbproto);
})();