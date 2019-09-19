const Info = require('./info');
const Soup = require('./soup');
const Parser = {};

// String docstr를 Soup로 반환한다.
Parser.parse_doc = function(docstr) {
	// pre-process
	let sentences = Parser.extract_sentences(docstr);
	let tokens = Parser.reorganize(Parser.tokenize(sentences));
	let soup = Parser.cook(tokens);
	return soup;
};

// 선두 공백문자(leading space)의 끝지점을 찾아 반환한다.
// ex: '  1234' -> 2
Parser.index_of_first_nonspace = function(target) {
	let result = target.match(/^( |'\t')*/);
	if(result)
		return result[0].length;
	else
		return 0;
};

// docstr에서 <문장>을 추출하여 String[]로 반환한다.
Parser.extract_sentences = function(docstr) {
	return docstr.split('\n')
	.map(s => {
	// 문장 앞에 나오는 공백을 제거한다.
	// 제거할 필요가 없을 땐 복사를 막기 위해 원본을 반환한다.
		let sidx = Parser.index_of_first_nonspace(s);
		if(sidx == 0)
			return s;
		else
			return s.slice(sidx);
	}).filter(s => {
	// 공백 제거 후 내용이 없는 문장은 삭제한다.
		return s != '';
	});
};

// sentences 배열의 원소들을 다음과 같이 가공하여 배열로 반환한다.
// 	[식별 기호가 제외된 문장, 토큰 분류]
//
// 원소가 <제목n식별자>인 경우, 마지막에 추가로 n을 적어준다.
// ex: '#### 4개짜리' -> ['4개짜리', '<제목n>', 4]
//
// 식별 기호를 제거했을 때 내용이 없는 토큰은 삭제한다.
// ex: '* ' -> 삭제
Parser.tokenize = function(sentences) {
	return sentences.map(s => {
		let match_info = null;
		if(match_info = s.match(/#+ /)) {
		// <제목n식별자>
			return [s.slice(match_info[0].length), '<제목n>',
				match_info[0].length - 1];
		} else if(match_info = s.match(/\- /)) {
		// <속성>
			return [s.slice(match_info[0].length), '<속성>'];
		} else {
		// <소주석>
			return [s, '<주석>'];
		}
	}).filter(token => {
		return token[0] != '';
	});
};

// 토큰열을 제목 서브토큰 주석 속성 순으로 만들어준다.
Parser.reorganize = function(tokens) {
	let stack = [];
	for(let i = tokens.length - 1; i >= 0; --i) {
		// 문서 상에서는 <소주석>과 <주석>을 이론적으로 구분하지만
		// 실제 코딩을 할 때는 구분이 필요없다.
		if(tokens[i][1] == '<주석>') {
			// 최초의 주석은 무시
			if(i == 0)
				break;

			if(tokens[i - 1][1] == '<주석>') {
			// 주석이 연달아 나오면 합친다.
				let merged = [];
				merged[0] = tokens[i - 1][0] + '\n' + tokens[i][0];
				merged[1] = '<주석>';
				tokens[i - 1] = merged;
			}
			else if(tokens[i - 1][1] == '<속성>') {
			// 속성이 앞에 있으면 자리를 바꾼다.
				let temp = tokens[i];
				tokens[i] = tokens[i - 1];
				tokens[i - 1] = temp;
				stack.push(tokens[i]);
			} 
			else {
			// 일반적인 주석이다.
				stack.push(tokens[i]);
			}
		} else {
			stack.push(tokens[i]);
		}
	}
	return stack.reverse();
};

// 토큰을 분석하여 수프를 만들어 Soup로 반환한다.
// Soup.roots에 루트가 있다.
Parser.cook = function(tokens) {
	// 에러
	if(tokens == null)
		throw new Error('[parser::cook] null pointer exception');

	// 지저분한 예외
	if(tokens.length == 0)
		return [];

	// 전체가 예쁜 루트로 묶여있으면 참 좋은데
	// 사용자들이 그렇게 예쁘게 적어줄 리가 없다.
	//
	// 한 과목 내에 여러 문서 파일이 존재할 수가 있으며
	// 문서마다 임의로 주제를 만들어 묶을 경우, 무의미한 주제가 생긴다.
	//
	// 그래서 포레스트로 인정을 하며, 그걸 어떻게 다룰지는
	// cook을 호출한 곳의 상황에 따라 결정하록 한다
	let soup = new Soup();
	let spos = 0;
	let epos = 1;
	let level = tokens[0][2];
	while(epos <= tokens.length) {
		if(epos == tokens.length) {
		// 맨 마지막 경우
			let temp = Parser.assemble(soup, tokens, spos, epos);
			// if(temp)
			// 	soup.roots.push(temp);
			spos = epos;
		}
		else if(tokens[epos][1] == '<제목n>' && tokens[epos][2] <= level) {
		// 현재 토큰의 뎁스보다 더 깊은 녀석은 자식이다
			level = tokens[epos][2];
			let temp = Parser.assemble(soup, tokens, spos, epos);
			// if(temp)
			// 	soup.roots.push(temp);
			spos = epos;
		}
		++epos;
	}
	return soup;
};

// 전제조건: tokens[spos]는 반드시 <제목n>이어야 하며
// [spos, epos) 구간의 제목 단계는 n보다 커야한다.
Parser.assemble = function(soup, tokens, spos, epos) {
	let out = soup.create_info([tokens[spos][0]], []);
	++spos;
	while(spos < epos) {
		if(tokens[spos][1] == '<주석>') {
		// 현재 토큰이 <주석>이면 현재 주제에 추가
			out.comment = tokens[spos][0];
			++spos;
		}
		else if(tokens[spos][1] == '<속성>') {
		// 현재 토큰이 <속성>이면 나중에 같은 이름의 지식 만듦
			out.attrs.push(tokens[spos][0]);
			++spos;
		}
		else if(tokens[spos][1] == '<제목n>') {
		// 현재 토큰이 <제목n>이면 자식을 만듦
			do {
				let idx = spos + 1;
				while(idx < tokens.length && 
					!(tokens[idx][1] == '<제목n>'
						&& tokens[idx][2] <= tokens[spos][2])) {
					++idx;
				}
				let temp = Parser.assemble(soup, tokens, spos, idx);
				if(temp)
					soup.append(out, temp);
				spos = idx;
			}
			while(spos < epos);
		}
	}

	if(out.attrs.length > 0 || out.childs.length > 0) {
		return out;
	}
	else {
	// 속성도 없고 자식주제도 없으면 무의미하므로 제거
		return null;
	}
};

/*
	이 코드의 내용은 abstraction.md를 잘 읽고 건드려야 한다.
*/
module.exports = Parser;