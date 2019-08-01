class Info {
	/*
		String[] names: 지식의 이름들, 반드시 1개 이상
		String[] attr: 지식의 속성들
	*/
	constructor(names, attrs) {
		console.assert(names instanceof Array && names.length > 0);
		console.assert(attrs instanceof Array);

		this.names = names;
		this.attrs = attrs;
		this.comment = '';

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
		
		this.ext = [];
	}
}

Info.jsidcnt = 0;

module.exports = Info;