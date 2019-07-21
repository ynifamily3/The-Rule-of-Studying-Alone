class Group {
	/*
		String name: 주제의 이름
	*/
	constructor(id, name) {
		console.assert(id !== undefined);
		console.assert(typeof(name) == 'string');
		console.assert(name);
		this.name = name;
		this.childgroups = [];    // GROUP REFERENCE
		this.infos = [];          // INFO  REFERENCE
		this.id = id;
		this.comment = '';
	}
}

class Info {
	/*
		String[] names: 지식의 이름, 반드시 1개 이상
		String[] attr: 지식의 속성, 반드시 1개 이상
	*/
	constructor(id, names, attrs) {
		console.assert(id !== undefined);
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array && attrs.length > 0);

		// names는 이 Info의 이름(들)을 String으로 저장한다.
		this.names = names;

		// attrs는 이 Info의 속성(들)을 String으로 저장한다.
		this.attrs = attrs;

		// groups는 이 Info가 소속된 주제(들)을 레퍼런스로 저장한다.
		this.basegroups = []; // 
		this.id = id;
	}
}

class Soup {
	constructor() {
		this.groups = [];
		this.infos = [];
		this.gcnt = 0;
		this.icnt = 0;
	}

	create_group(name) {
		let temp = new Group(this.gcnt++, name);
		this.groups.push(temp);
		return temp;
	}

	create_info(names, attrs) {
		let temp = new Info(this.icnt++, names, attrs);
		this.infos.push(temp);
		return temp;
	}

	// parent에 child를 직속주제 또는 직속지식으로 추가하고
	// true를 반환한다. 이미 소속이 돼 있는 경우 false를
	// 반환한다.
	append(parent, child) {
		if(child instanceof Group)
			this.__append_group(parent, child);
		else if(child instanceof Info)
			this.__append_info(parent, child);
		else
			throw new Error('child is neither Group or Info');
	}

	__append_group(parent, child) {
		// 하위 주제에서 상위 주제로 가는 경로가 있는지 검사한다.

		// 상위 주제가 하위 주제를 이미 포함하고 있는지 확인한다.
		if(parent.childgroups.indexOf(child) != -1)
			return false;

		parent.childgroups.push(child);
		return true;
	}

	__append_info(parent, info) {
		// 상위 주제가 이 지식을 이미 포함하고 있는지 확인한다.
		if(parent.infos.indexOf(info) != -1)
			return false;

		parent.infos.push(info);
		info.basegroups.push(parent);
		return true;
	}

	// 주제 g로부터 도달할 수 있는 모든 지식을 반환한다.
	fetch_subinfos(g) {
		function __getSubInfos(node, out, dup) {
			node.infos.forEach(info => {
				if(!dup[info.id]) {
					out.push(info);
					dup[info.id] = true;
				}
			});
			node.childgroups.forEach(child => {
				__getSubInfos(child, out, dup);
			});
			return out;
		}
		return __getSubInfos(g, [], {});
	}

	/*
		이 Group의 상태를 보여줄 수 있는 트리를 텍스트로 그린다.
		이 함수의 외부에서 사용 시 인자는 없다.

		엄밀하게는 이 DB는 DAG이지 Tree는 아니다.
		하지만 직관적으로 확인하기 위해 Tree로 간주하고 그린다.
	*/
	get_tree() {
		function _getTreeText(node, out, tab) {
			out += `${tab}${node.name}\n`;
			tab += '. . ';
			node.infos.forEach(info => {
				out += `${tab}info[${info.id}] ${info.names[0]}\n`;
				info.attrs.forEach(attr => {
					out += `${tab} * ${attr}\n`;
				});
			});
			node.childgroups.forEach(child => {
				out = _getTreeText(child, out, tab);
			});
			
			return out;
		}
		return _getTreeText(this.groups[0], '', '');
	}
}