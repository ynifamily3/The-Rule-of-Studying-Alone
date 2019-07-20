/*
	Group은 주제를 담는 클래스다.
	주제는 이름, 하위주제, 지식을 담는다.

	주제 g의 주제 i는 반드시 소속주제를 g로 가져야 한다.
	즉 하위주제의 지식은 g의 지식이 아니다.

	주제의 이름은 하나만 가질 수 있다.
	ex) 소녀전선
	주제의 이름은 유니코드로 표현할 수 있는, 개행문자를 제외한
	모든 문자를 허용한다. 단 같은 상위 주제 내에서는 동일한
	이름을 가질 수 없다.

	주제는 여러 하위주제를 가질 수 있으며
	하나의 주제가 여러 주제의 하위주제에 속할 수 있다.
	ex) 게임 <- 소녀전선, XDGlobal <- 소녀전선

	주제와 지식은 N:N 관계이기 때문에, 연결상태는 DB 또는
	상위 중계자가 연결하는 것이 바람직하다.
*/
class Group {
	/*
		String name: 주제의 이름
	*/
	constructor(name) {
		console.assert(typeof(name) == 'string');
		console.assert(name);
		this.name = name;
		this.childgroups = [];    // GROUP ID
		this.infos = [];          // INFO  ID
		this.id = Group.idcnt++;
		this.comment = '';
	}
}

Group.idcnt = 0;