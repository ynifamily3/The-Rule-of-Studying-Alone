let Ranker = {};

Ranker.dtw = function(s, t) {
		let d = [];

		//init
		for(let i = 0; i <= s.length; ++i)
				d.push([]);
		for(let i = 0; i <= s.length; ++i)
				for(let j = 0; j <= t.length; ++j)
						d[i][j] = 999999;
		d[0][0] = 0;

		//comp
		for(let i = 1; i <= s.length; ++i) {
					for(let j = 1; j <= t.length; ++j) {
									let cs = s.charCodeAt(i - 1);
									let ct = t.charCodeAt(j - 1);
									let cost = (cs == ct ? 0 : 1);
									d[i][j] = cost + Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]);
								}
				}
		return d[s.length][t.length];
};

Ranker.remove_whitespace = function(w) {
		return w.replace(new RegExp(/( |\n|\t)/, 'g'), '');
}

// String[] targets에서 String word에 가장 가까운 것 순서대로
// 다시 정렬하여 반환한다.
Ranker.find_top_k_match = function(word, targets, k) {
		word = Ranker.remove_whitespace(word);
		word = word.toLowerCase();
		return targets.map(target => {
					let obj = target;
			console.log("target___________",target)
			target = target.name;
			console.log("target-------------------",target)
					return [Ranker.dtw(word, Ranker.remove_whitespace(target).toLowerCase()) / (word.length + target.length), obj];
				}).filter(pair => {
							return pair[0] < 0.5;
						}).sort((a, b) => {
									return a[0] - b[0];
								}).map(pair => {
											return pair[1];
										}).slice(0, k);
}

module.exports = Ranker;
