const Util = require('./src/util');

class Node {
	constructor(name) {
		this.name = name;
		this.parents = [];
		this.childs = [];
		this.weight = 0;
		this.weight_sum = 0;
	}
}

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

	let cnt = 0;
	G.V.forEach(val => {
		val.weight += ratio[cnt++];
	});
}

document.getElementById('run').onclick = (evt => {
	let str = document.getElementById('in_string').value;
	str = (str === undefined ? '' : str);
	let N = parseInt(document.getElementById('N').value);
	let G = create_graph(str);
	distribute(G, N);
	document.getElementById('result').innerText = G.make_report();
});