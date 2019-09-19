(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
		ratio[i] = quotient;5
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
	root에서 출제되지 않은 문제는 전이하여 자식을
	모은 뒤 
	Node root
	{int->boolean} used: 문제출제여부
	{
		tr: int->[...],  계산 중간 결과 값을 메모이징함
	} cached: 

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
	let cache = {};
	let new_roots = extract_subgraph(roots, used, cache);
	console.log(new_roots);
	console.log(new_roots.reduce((acc, node) => {
		return acc + `${node.origin.name}, `;
	}, ''));

	let check = {};
	new_roots.forEach(root => {
		traverse(root, outdom, check);
	});
});
},{"./src/util":2}],2:[function(require,module,exports){
const Util = {};

/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 임의의 정수를 반환한다.
*/
Util.random_int = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min + 0.5);
};

/*
	min ≤ x ≤ max, x ∈ Z를 만족하는 중복되지 않는
	n개의 서로 다른 x를 만들어서 반환한다.
	O(max - min)의 공간복잡도와 시간복잡도가 발생한다.
*/
Util.random_choices = function(min, max, n) {
	min = Math.ceil(min);
	max = Math.floor(max);
	let N = max - min + 1;
	if(N < n) {
		throw new Error(`[random_choice] Cannot choose ${n} different numbers between ${min} ~ ${max}`);
	}

	// min ~ max까지의 숫자를 만든다
	let out = [];
	for(let i = 0; i < N; ++i)
		out[i] = min + i;

	// 적당히 섞는다.
	Util.shuffle(out);

	// n개만 반환한다.
	if(n == N)
		return out;
	else
		return out.slice(0, n);
};

/*
	arr를 무작위로 섞는다.
	outplace가 true이면 새 배열을 반환한다.
*/
Util.shuffle = function(arr, outplace) {
	if(outplace)
		arr = arr.slice();
	let temp, idx1, idx2;
	for(let i = 0; i < arr.length; ++i) {
		idx1 = Util.random_int(0, arr.length - 1);
		idx2 = Util.random_int(0, arr.length - 1);
		temp = arr[idx1];
		arr[idx1] = arr[idx2];
		arr[idx2] = temp;
	}
	return arr;
};

/*
	배열 arr에서 아무 원소나 반환한다.
	시간 복잡도가 O(1)이다
*/
Util.get_randomly = function(arr) {
	return arr[Util.random_int(0, arr.length - 1)];
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
	시간 복잡도가 O(n)이다
*/
Util.get_randomly_multi = function(arr, n) {
	return Util.random_choices(0, arr.length - 1, n).map(idx => {
		return arr[idx];
	});
};

/*
	배열 arr에서 아무 원소를 n개 찍어서 반환한다.
	중복이 허용된다.
*/
Util.get_randomly_multi_dup = function(arr, n) {
	let out = [];
	for(let i = 0; i < n; ++i)
		out[i] = Util.get_randomly(arr);
	return out;
};

module.exports = Util;
},{}]},{},[1]);
