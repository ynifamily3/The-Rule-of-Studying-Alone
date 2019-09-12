const Info = require('./info');
const Util = require('./util');

/*
	Soup를 Parser.parse_doc으로 얻어낸 이후
	Invariant를 만족하는지 확인하려면 다음과 같이 짜시오.

	(4지1답만 만들 경우)

	let soup = Parser.parse_doc(MD문자열)
	let issues = soup.validation_check({n: 4, a: 1})
	issues.forEach(issue => {
		// 문제점이 있는 info임
		// null이라면, 개별 info의 문제보다 스프 전체의 문제인 경우
		let info = issue.info;
		
		// what에 문제점을 문자열로 기록.
		alert(issue.what);
	})
*/
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

	validation_check(numargs) {
		let n = numargs.n;
		let a = numargs.a;
		console.assert(n !== undefined);
		console.assert(a !== undefined);
		let p = Math.max(n - a, a);

		let issues = [];
		let dup = {};
		function _attr_check(node, dup, issues) {
			// 중복방지
			if(dup[node.jsid])
				return;
			dup[node.jsid] = true;

			// 검사
			if(node.attrs.length > 0 && node.attrs.length < p)
				issues.push({
					info: node,
					what: `${node.names[0]}의 속성이 너무 적습니다(${node.attrs.length}개). ${p}개 이상이어야 문제를 만들 수 있습니다.`
				});

			node.childs.forEach(child => _attr_check(child, dup, issues));
		}
		this.roots.forEach(root => _attr_check(root, dup, issues));
		return issues;
	}
}

// 지식 g들로부터 도달할 수 있는 모든 지식을 반환한다.
Soup.fetch_subinfos = function(gs) {
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

	let dup = {};
	let out = [];
	gs.forEach(g => __fetch_subinfos(g, out, dup));
	return out;
};

// 지식들 infos에 존재하는 모든 속성의 수를 구한다.
// DFS를 돌리므로 주의해서 사용해야 한다.
Soup.total_attrs_count = function(infos) {
	let cnt = 0;
	function __total_attrs_count(info, dup) {
		cnt += info.attrs.length;
		info.childs.forEach(child => {
			if(!dup[child.jsid]) {
				dup[child.jsid] = true;
				__total_attrs_count(child, dup);
			}
		});
	}
	let dup = {};
	infos.forEach(info => __total_attrs_count(info, dup));
	return cnt;
};

// 지식 material에서 임의의 속성을 선택한다.
Soup.select_positive_attr = function(material) {
	return Util.get_randomly(material.attrs);
};

// 지식 material에서 겹치지않는 n개의 임의의 속성들을 선택한다
Soup.select_positive_attrs = function(material, n) {
	return Util.get_randomly_multi(material.attrs, n);
};

// 지식 material의 속성과 반하는 속성 또는 무관한 속성을 반환한다.
//
// 현재는 material에 대하여 명제가 충돌하는지 검사할 방법이 없으므로
// 그냥 아무거나 잡는다.
Soup.select_negative_attrs = function(root, material, n) {
	console.assert(root instanceof Info);
	console.assert(material instanceof Info);
	console.assert(typeof(n) == 'number');

	// 클로저
	let check = new Map();
	let refs = new Map();

	// 내부 함수 원리는 select_negative_attr.md 참고 바람
	// Info root
	function discard_subinfos(root) {
		check.set(root.jsid, Soup.TYPE_I);
		root.childs.forEach(child => {
			let ctype = check.get(child.jsid);
			if(ctype === undefined || ctype == Soup.TYPE_O)
				discard_subinfos(child);
		});
	}

	// Info root 		출제범위 상한선
	// Info material 	출제주제
	// 반환값은 root가 material로 가는 경로를 가진 경우 TYPE_M
	// 그렇지 않은 경우 TYPE_O
	function traverse_down(root, material) {
		if(root == material) {
			discard_subinfos(material);
			check.set(root.jsid, Soup.TYPE_M);
			return Soup.TYPE_M;
		}
		else {
			let rtype = Soup.TYPE_O;
			root.childs.forEach(child => {
				let ctype = check.get(child.jsid);
				if(ctype === undefined)
					ctype = traverse_down(child, material);
				if(ctype == Soup.TYPE_M)
					rtype = Soup.TYPE_M;
			});
			check.set(root.jsid, rtype);

			// 알고리즘 특성상 jsid를 키로 갖는 map을 순환
			// 해야하는데, 어차피 반환하지도 않을 TYPE_M이나
			// TYPE_I는 굳이 저장할 필요가 없으므로 재낀다
			if(rtype == Soup.TYPE_O)
				refs.set(root.jsid, root);
			return rtype;
		}
	}

	// 정말로 사용할 수 있는 애들만 추림
	// refs에는 과거에 TYPE_O였지만 나중에 TYPE_M으로 바뀐
	// 것들이 존재할 수 있기 때문에 마지막 체크를 한 번 더 해
	// 줘야함
	let out = [];
	traverse_down(root, material);
	refs.forEach((val, key) => {
		if(check.get(key) == Soup.TYPE_O)
			out.push(val);
	});

	// 1개짜리와 n개짜리를 처리하는데 복잡도가 달라지기 때문에
	// 특별히 구분해준다.
	// Util.get_randomly의 반환형은 배열이 아니기 때문에
	// 호환성을 위해 배열로 만들어준다.
	if(n == 1) {
		return [Util.get_randomly(out.reduce((accm, info) => {
			// if(is_subject_to(info, material))
			// 	return accm.concat(info.attrs);
			// else
			// 	return accm;
			return accm.concat(info.attrs);
		}, []))];
	}
	else {
		return Util.get_randomly_multi(out.reduce((accm, info) => {
			// if(is_subject_to(info, material))
			// 	return accm.concat(info.attrs);
			// else
			// 	return accm;
			return accm.concat(info.attrs);
		}, []), n);
	}
};

Soup.TYPE_I = 1;
Soup.TYPE_M = 2;
Soup.TYPE_O = 3;

// select_negative_attr의 복수버전
// Soup.select_negative_attrs = function(material, subinfos, n) {
// 	return Util.get_randomly_multi(subinfos.reduce((accm, info) => {
// 		if(info == material)
// 			return accm;
// 		else
// 			return accm.concat(info.attrs);
// 		// else if(is_subject_to(info, material))
// 		// 	return accm.concat(info.attrs);
// 		// else
// 		// 	return accm;
// 	}, []), n);
// };

module.exports = Soup;