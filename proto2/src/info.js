/*
	Info는 지식을 담는 클래스다.
	지식은 이름, 속성을 담는다.

	지식의 이름은 여러 개를 가질 수 있다.
	ex) S.A.T.8, 삿팔이, サトハチ

	지식의 속성도 여러 개를 가질 수 있다.
	ex) 샷건이다, 안나온다, 중형제조 ...

	지식은 여러 소속의 주제를 가질 수 있다.
	ex) SG, 희귀종

	Info는 정수 id로 직접 접근할 수 있으나
	Group을 통해서 접근하는 것이 바람직하다.
*/
class Info {
	/*
		String[] names: 지식의 이름, 반드시 1개 이상
		String[] attr: 지식의 속성, 반드시 1개 이상
	*/
	constructor(names, attrs) {
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array && attrs.length > 0);

		// names는 이 Info의 이름(들)을 String으로 저장한다.
		this.names = names;

		// attrs는 이 Info의 속성(들)을 String으로 저장한다.
		this.attrs = attrs;

		// groups는 이 Info가 소속된 주제(들)을 ID로 저장한다.
		this.basegroups = []; // 
		this.id = Info.idcnt++;
	}
}

Info.idcnt = 0;