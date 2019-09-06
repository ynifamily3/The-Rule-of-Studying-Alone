const Util = require('./src/util');

class Node {
	constructor(name) {
		this.name = name;
		this.parents = [];
		this.childs = [];
		this.weight = 0;
		this.weight_sum = 0;
		this.jsid = Node.jsid++;
	}
}

Node.jsid = 0;

class Graph {
	constructor() {
		this.V = new Map();
	}

	create_node(name) {
		// name 유효성 확인
		console.assert(name && typeof(name) === 'string');
		if(this.V.get(name))
			return;
		this.V.set(name, new Node(name));
	}

	connect(name1, name2) {
		// 존재확인
		console.assert(name1 && this.V.has(name1));
		console.assert(name2 && this.V.has(name2));
		let v1 = this.V.get(name1);
		let v2 = this.V.get(name2);

		// 중복확인
		if(v1.childs.indexOf(v2) !== -1)
			return;
		v1.childs.push(v2);
		v2.parents.push(v1);
	}

	make_report() {
		let out = '';
		for(let pair of this.V) {
			let v = pair[1];
			out += `${v.name} : weight = ${v.weight} and total = ${v.weight_sum}\n`;
		}
		return out;
	}
}

// 문자열 입력을 받아서 그래프를 만든다.
function create_graph(str) {
	console.assert(str && typeof(str) === 'string');
	let G = new Graph();
	str.split('\n').forEach(line => {
		// 화살표로 분리
		let match_result = line.indexOf('->');
		if(match_result === -1)
			return;

		// 이름 추출
		let name1 = line.substr(0, match_result).trim();
		let name2 = line.substr(match_result + 2).trim();
		
		// 그래프에 등록
		// 중복은 알아서 걸러냄
		G.create_node(name1);
		G.create_node(name2);
		G.connect(name1, name2);
	});
	return G;
}

// 그래프 G에 weight N을 최대한 균등분배한다.
// 그리고 출제한 노드의 id를 map으로 반환한다.
// 반환한 맵은 set처럼 쓰면 된다.
function distribute(G, N) {
	// 안전장치
	if(N <= 0)
		return;

	// 초기화
	let ratio = [];
	let M = G.V.size;
	let quotient = Math.floor(N / M);
	for(let i = 0; i < M; ++i)
		ratio[i] = quotient;
	N -= quotient * M;
	
	// 나머지는 랜덤분배
	if(N > 0) {
		Util.random_choices(0, ratio.length - 1, N).forEach(idx => {
			ratio[idx] += 1;
		});
	}

	let used = {};
	let cnt = 0;
	G.V.forEach(val => {
		val.weight += ratio[cnt++];
		if(val.weight > 0)
			used[val.jsid] = true;
	});
	return used;
}

/*
	return:
		{
			origin: 기존노드, 
			childs: [전이적자식]
		}[]
*/
function find_transition(root, used, comm) {
	// 이미 캐싱된 값이면 반환
	if(comm[root.jsid])
		return comm[root.jsid].tr;

	/*
		define comm[id]: {
			tr      : 캐시된 transitive child
			is_root : id 노드가 서브그래프의 루트인지 여부
			is_added: 최종적으로 반환되었는지
		}
	*/
	comm[root.jsid] = {};
	if(used[root.jsid])
		comm[root.jsid].is_root = true;

	// 아니면 계산
	let new_childs = [];
	root.childs.forEach(child => {
		// O(n^2)의 복잡도가 발생하지만 개별 직속 자식의 수는 적기 때문에
		// 어설프게 map을 써서 구조를 지저분하게 만드는 것보다는 나을 것
		let feasible = find_transition(child, used, comm);
		feasible.forEach(fc => {
			if(new_childs.indexOf(fc) == -1)
				new_childs.push(fc);
		});
	});

	// 문제출제 사용 여부에 따라 결정
	let result;
	if(used[root.jsid])
	{
		result = [{origin: root, childs: new_childs}];

		// transitive 자식들을 루트가 아니라고 보고한다
		new_childs.forEach(cnode => {
			comm[cnode.origin.jsid].is_root = false;
		});
	}
	else
		result = new_childs;
	comm[root.jsid].tr = result;

	return result;
}

/*
	Node[] roots: 포레스트의 루트들
	{int->boolean} used: 문제출제여부
*/
function extract_subgraph(roots, used, comm) {
	let new_roots = [];
	roots.forEach(root => {
		let feasible = find_transition(root, used, comm);
		feasible.forEach(cnode => {
			let origin = cnode.origin;
			if(comm[origin.jsid].is_root && !comm[origin.jsid].is_added)
			{
				comm[origin.jsid].is_added = true;
				new_roots.push(cnode);
			}
		});
	});
	return new_roots;
}

/*
					TODO

	그래프는 제대로 형성한 거 같지만 사소한 버그가 있음
	find_transition은 피호출 함수의 전이적 자식을
	반환하지만, 최상단 호출 시 루트를 반환하지는 않는다.

	뒤늦게 어떤 노드로의 연결을 찾는 경우도 있기 때문이다.
	먼저 실행된 find_transition이 반환하는 값이
	루트라는 보장이 없다.

	때문에 extract_subgraph의 반환 값에 동일한 root가 
	여러 개가 되는 버그가 있다.
*/


function traverse(new_root, outdom, dup) {
	if(dup[new_root.origin.jsid])
		return;
	dup[new_root.origin.jsid] = true;
	new_root.childs.forEach(child => {
		outdom.innerText += new_root.origin.name + ' -> ' + child.origin.name + '\n';
		traverse(child, outdom, dup);
	});
}

document.getElementById('run').onclick = (evt => {
	// 그래프를 분석한다.
	let str = document.getElementById('in_string').value;
	str = (str === undefined ? '' : str);
	let N = parseInt(document.getElementById('N').value);
	let G = create_graph(str);

	// 문제를 배분한다. O(N)
	let used = distribute(G, N);
	let outdom = document.getElementById('result');
	outdom.innerText = G.make_report();

	// 포레스트의 루트들을 찾는다. O(N)
	let roots = [];
	G.V.forEach(node => {
		if(node.parents.length == 0)
			roots.push(node);
	});

	// 서브그래프를 추출한다.
	let new_roots = extract_subgraph(roots, used, {});

	// new_roots에 있는 것들을 확인
	console.log(new_roots.reduce((acc, node) => {
		return acc + `${node.origin.name}, `;
	}, ''));

	// new_roots가 이루는 그래프의 모든 간선을 출력
	let check = {};
	new_roots.forEach(root => {
		traverse(root, outdom, check);
	});
});