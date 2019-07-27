// class Group {
// 	/*
// 		String name: 주제의 이름
// 	*/
// 	constructor(id, name) {
// 		console.assert(id !== undefined);
// 		console.assert(typeof(name) == 'string');
// 		console.assert(name);
// 		this.name = name;
// 		this.childgroups = [];    // GROUP REFERENCE
// 		this.infos = [];          // INFO  REFERENCE
// 		this.id = id;
// 	}
// }

class Info {
	/*
		String[] names: 지식의 이름들, 반드시 1개 이상
		String[] attr: 지식의 속성들
	*/
	constructor(names, attrs) {
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array);

		// names는 이 Info의 이름(들)을 String으로 저장한다.
		this.names = names;

		// attrs는 이 Info의 속성(들)을 String으로 저장한다.
		this.attrs = attrs;

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

		this.comment = '';
		this.ext = [];
	}
}

Info.jsidcnt = 0;

class Soup {
	constructor() {
		// this.groups = [];
		this.infos = [];
		// this.gcnt = 0;
		// this.icnt = 0;
	}

	// create_group(name) {
	// 	let temp = new Group(name);
	// 	this.groups.push(temp);
	// 	return temp;
	// }

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
		function _getTreeText(info, out, tab) {
			out += `${tab}info[${info.id}] ${info.names[0]}\n`;
			tab += '. . ';
			info.attrs.forEach(attr => {
				out += `${tab} * ${attr}\n`;
			});
			info.childs.forEach(child => {
				out = _getTreeText(child, out, tab);
			});
			return out;
		}
		return _getTreeText(this.infos[0], '', '');
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
	return get_randomly(material.attrs);
};

// 지식 material에서 겹치지않는 n개의 임의의 속성들을 선택한다
Soup.select_positive_attrs = function(material, n) {
	return get_randomly_multi(material.attrs, n);
};

// 지식들 subinfos에서 지식 material과 충돌하지 않는 속성을 선택한다.
// 원래 문서에는 매번 subinfos를 구하지만 이는 비효율적이므로, 외부에서
// 사전에 구하도록 한다. 
//
// 현재는 material에 대하여 명제가 충돌하는지 검사할 방법이 없으므로
// 그냥 아무거나 잡는다.
Soup.select_negative_attr = function(material, subinfos) {
	return get_randomly(subinfos.reduce((accm, info) => {
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
	return get_randomly_multi(subinfos.reduce((accm, info) => {
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