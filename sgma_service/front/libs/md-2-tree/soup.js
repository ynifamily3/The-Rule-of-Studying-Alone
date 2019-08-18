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