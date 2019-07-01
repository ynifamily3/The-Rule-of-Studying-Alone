class ChoiceQuest {
	/*
		question은 문제에 표시될 질문에 해당한다.
		choices는 문제의 선택지를 의미하는 문자열의 배열이다.
		answer는 문제의 답을 의미하는 수열이다.
		ext는 필요에 따라 추가할 수 있는 옵션이다. 
	*/
	constructor(question, choices, answers, ext) {
		console.assert(typeof(question) == 'string');
		console.assert(choices instanceof Array);
		console.assert(answers instanceof Array);
		this.question = question;
		this.choices = choices;
		this.answers = answers;
		this.ext = (ext === undefined ? {} : ext);
	}
}

class ChoiceQuestGenerator {
	/*
		N개의 선택지에서 M개의 정답을 고르기
		is_positive가 true이면 참인 것을
		is_positive가 false이면 거짓인 것을 골라야 한다.
	*/
	constructor(N, M, is_positive) {
		this.N = N;
		this.M = M;
		this.is_positive = is_positive;
		if(this.N < this.M)
			throw new Error('[ChoiceQuestGenerator] 정답의 수가 선택지 수보다 많습니다');
	}

	/*
		주제 G에서 랜덤하게 문제를 하나 만든다.
	*/
	createQuest(G) {
		// pos: 참인 명제를 선택할 지식
		// neg: 거짓인 명제를 선택할 지식
		// 공통소재
		let ing = dbproto.getSubInfos(G);
		let A = (this.is_positive ? this.M : this.N - this.M);

		let pos = ing.filter(info => {
			return info.attrs.length >= A;
		});
		let center = get_randomly(pos);
		
		let neg = ing.filter(info => {
			return info.id != center.id;
		});

		let name = get_randomly(center.names);
		let question = `다음 중 ${name}에 대한 설명으로 ${this.is_positive ? '옳은' : '옳지 않은'} 것을 ${this.M > 1 ? '모두 ' : ''}고르시오.`;
		let pos_attrs = get_randomly_multi(center.attrs, A)
			.map(attr => { 
				return [attr, this.is_positive]; 
			});
		let neg_attrs = get_randomly_multi_dup(neg, this.N - A)
			.map(info => {
				return [get_randomly(info.attrs), !this.is_positive];
			});
		console.log(neg_attrs);
		let choices = shuffle(pos_attrs.concat(neg_attrs));
		let ans = [];
		for(let n = 0; n < this.N; ++n) {
			if(choices[n][1])
				ans.push(n);
		}

		return new ChoiceQuest(question, choices, ans);
	}
}