/*
	Group은 주제를 담는 클래스다.
	주제는 이름, 하위주제, 지식을 담는다.

	주제 g의 주제 i는 반드시 소속주제를 g로 가져야 한다.
	즉 하위주제의 지식은 g의 지식이 아니다.

	주제의 이름은 하나만 가질 수 있다.
	ex) 소녀전선
	주제의 이름은 유니코드로 표현할 수 있는, 개행문자를 제외한
	모든 문자를 허용한다. 단 같은 상위 주제 내에서는 동일한
	이름을 가질 수 없다.

	주제는 여러 하위주제를 가질 수 있으며
	하나의 주제가 여러 주제의 하위주제에 속할 수 있다.
	ex) 게임 <- 소녀전선, XDGlobal <- 소녀전선

	주제와 지식은 N:N 관계이기 때문에, 연결상태는 DB 또는
	상위 중계자가 연결하는 것이 바람직하다.
*/
class Group {
	/*
		String name: 주제의 이름
	*/
	constructor(name) {
		console.assert(typeof(name) == 'string');
		console.assert(name);
		this.name = name;
		this.subgroups = [];      // GROUP ID
		this.infos = [];          // INFO  ID
		this.id = Group.idcnt++;
	}
}

Group.idcnt = 0;

/*
	Info는 지식을 담는 클래스다.
	지식은 이름, 속성을 담는다.

	지식의 이름은 여러 개를 가질 수 있다.
	ex) S.A.T.8, 삿팔이, サトハチ

	지식의 속성도 여러 개를 가질 수 있다.
	ex) 샷건이다, 안나온다, 중형제조 ...

	지식은 여러 소속의 주제를 가질 수 있다.
	ex) SG, 희귀종

	Info는 정수 id로 직접 접근할 수 있으나
	Group을 통해서 접근하는 것이 바람직하다.
*/
class Info {
	/*
		String[] names: 지식의 이름, 반드시 1개 이상
		String[] attr: 지식의 속성, 반드시 1개 이상
	*/
	constructor(names, attrs) {
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array && attrs.length > 0);

		// names는 이 Info의 이름(들)을 String으로 저장한다.
		this.names = names;

		// attrs는 이 Info의 속성(들)을 String으로 저장한다.
		this.attrs = attrs;

		// groups는 이 Info가 소속된 주제(들)을 ID로 저장한다.
		this.groups = []; // 
		this.id = Info.idcnt++;
	}
}

Info.idcnt = 0;

/*
	프로토타입 시연에서 사용할 임시 db이다.

	기본적으로 Group과 Info를 자기참조 그래프로 관리하지만
	입출력의 용이성을 위해 ID 맵으로도 관리한다.
*/
class DBProto {
	constructor() {		
	}

	async load() {
		try {
			// 주의사항: localforage에서 불러온 데이터들의 [[prototype]]은
			// 보존되지 않으며 Object로 취급한다. 주의 바람.
			this.groups = await localforage.getItem('groups');
			if(this.groups == null)
				this.groups = [new Group('__ROOT__')];
			Group.idcnt = this.groups.length;
			console.log(this.groups);

			this.infos = await localforage.getItem('infos');
			if(this.infos == null)
				this.infos = [];
			Info.idcnt = this.infos.length;
			console.log(this.infos);
		} catch(e) {
			console.log(e);
		}
	}

	/*
	*/
	createGroup(name) {
		let temp = new Group(name);
		this.groups.push(temp);
		localforage.setItem('groups', this.groups);
		return temp;
	}

	createInfo(names, attrs) {
		let temp = new Info(names, attrs);
		this.infos.push(temp);
		localforage.setItem('infos', this.infos);
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