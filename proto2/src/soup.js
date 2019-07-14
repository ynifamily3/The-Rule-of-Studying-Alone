/*
*/
class Soup {
	constructor() {
		this.groups = [];
		this.infos = [];
	}

	/*
	*/
	createGroup(name) {
		let temp = new Group(name);
		this.groups.push(temp);
		return temp;
	}

	createInfo(names, attrs) {
		let temp = new Info(names, attrs);
		this.infos.push(temp);
		return temp;
	}

	connectGroup(g, parent_name) {
		// 상위 주제를 불러온다
		let pg = this.searchGroup(parent_name);
		if(pg == null) {
			alert('주제 "' + parent_name + '"은 존재하지 않습니다.');
			return;
		}

		// 하위 주제에서 상위 주제로 가는 경로가 있는지 검사한다.
		if(this.searchGroup(pg.name, g) != null) {
			alert('주제 "' + pg.name + '"는 이미 주제 "' + g.name + '"의 하위 주제입니다.')
			return;
		}
		
		// 상위 주제가 하위 주제를 이미 포함하고 있는지 확인한다.
		if(pg.subgroups.indexOf(g.id) == -1)
			pg.subgroups.push(g.id);

		localforage.setItem('groups', this.groups);
	}

	connectInfo(i, group_name) {
		// 상위 주제를 불러온다
		let pg = this.searchGroup(group_name);
		if(pg == null) {
			alert('주제 "' + group_name + '"은 존재하지 않습니다.');
			return;
		}

		if(pg.infos.indexOf(i.id) == -1) {
			pg.infos.push(i.id);
			i.groups.push(pg.id);
		}

		localforage.setItem('groups', this.groups);
		localforage.setItem('infos', this.infos);
	}

	/*
		주제 g의 문제재료들을 반환한다.
		문제재료는 주제로부터 도달할 수 있는 모든 지식이다.
	*/
	getSubInfos(g) {
		let self = this;
		function __getSubInfos(node, out, dup) {
			if(!out)
				out = [];
			if(!dup)
				dup = {};
			node.infos.forEach(iid => {
				if(!dup[iid]) {
					out.push(self.infos[iid]);
					dup[iid] = true;
				}
			});
			node.subgroups.forEach(sgid => {
				__getSubInfos(self.groups[sgid], out, dup);
			});
			return out;
		}
		return __getSubInfos(g);
	}

	/*
		이름이 name인 주제를 반환한다.
		그런게 없으면 null을 반환한다.
	*/
	searchGroup(name, from) {
		if(from === undefined)
			from = this.groups[0];
		console.assert(typeof(name) == 'string');
		let self = this;
		function _searchGroup(node) {
			//
			if(node.name == name)
				return node;

			// 직속 하위 주제 중 해당 이름을 가진 것이 있는지 본다.
			for(let n = 0; n < node.subgroups.length; ++n) {
				let sgid = node.subgroups[n];
				if(self.groups[sgid].name == name)
					return self.groups[sgid];
			}

			// 재귀적으로 그런 이름을 가진 것이 있는지 본다.
			let temp = null;
			for(let n = 0; n < node.subgroups.length; ++n) {
				let sgid = node.subgroups[n];
				if((temp = _searchGroup(self.groups[sgid])) != null)
					break;
			}
			return temp;
		}
		return _searchGroup(from);
	}
	

	/*
		이 Group의 상태를 보여줄 수 있는 트리를 텍스트로 그린다.
		이 함수의 외부에서 사용 시 인자는 없다.

		엄밀하게는 이 DB는 DAG이지 Tree는 아니다.
		하지만 직관적으로 확인하기 위해 Tree로 간주하고 그린다.
	*/
	getTreeText() {
		let self = this;
		function _getTreeText(node, out, tab) {
			out += tab + node.name + '\n';
			tab += '. . . ';
			node.subgroups.forEach(sgid => {
				out = _getTreeText(self.groups[sgid], out, tab);
			});
			node.infos.forEach(iid => {
				let info = self.infos[iid];
				out += tab + 'info[' + iid + '] ' + info.names[0] + '\n';
			});
			return out;
		}
		return _getTreeText(this.groups[0], '', '');
	}
}