# 통신 프로토콜

본 문서에서는 클라이언트-서버 간 **필기**와 **스프**를 송수신 하는 방식을 서술한다.



## `Info`의 `id` 설정

`Info.id`는 서로 다른 **지식**을 식별하기 위한 필드로, 정수 또는 해쉬값이 될 수 있다.

몽고 DB에선 모든 `BSON document`에 기본키 `_id`를 자동으로 부여한다. 이 값은 몽고 DB에서 임의의 두 엔티티를 구분하는데 쓸 수 있다. 따라서 `Info.id`는 반드시 몽고 DB로부터 부여받는 `_id` 값으로 설정해야 한다.

그런데 **지식**이 생성되는 곳은 서버가 아닌 클라이언트다. 클라이언트는 접속한 적도 없는 몽고 DB의 기본키를 알 수가 없으므로, 최초 생성시에 한해 `Info.id`를 `null`로 정의한다.

한 번이라도 해당 **지식**이 서버를 경유할 경우, 반드시 기본키를 부여받도록 한다.



## `Soup`의 토폴로지 송수신

클라이언트에서는 개발 생산성 증대 및 최적화를 위해, 인접한 정점의 레퍼런스를 저장하여 그래프를 구현했다. 그러나 레퍼런스 타입은 해당 클라이언트의 해당 세션에서만 유의미하다. 따라서 부모/자식 관계를 서버에 저장하거나 받으려면 직렬화가 필요하다.

먼저 **토폴로지 메시지**를 다음과 같이 정의한다.

```pseudocode
define TopologyMessage:
	JSONfiedInfo[]	jsoninfos	// +
	<int, int>[]	connections	// *, infos의 원소 간 연결관계를 저장
	String 			type		// 1, 'add', 'del' 중 하나
```

`JSONfiedInfo`는 `Info`에서 자식/부모의 레퍼런스를 제거하고 순수 문자열로만 이루어진 JSON 오브젝트다.

`type`은 **토폴로지 메시지**가 어떤 동작을 수행해야하는지를 나타낸다.

* `add`: DB에 지식들을 추가한다.
* `del`: DB에 지식들을 삭제한다.

수정 쿼리가 존재하지 않는 이유는 다음과 같다.

1. 사용자가 **필기**를 수정하면 **스프**를 다시 조리(re-cooking)해야 하는데, 그 결과와 기존 **스프** 간의 차이점을 찾는 것이 매우 어렵다. 대안적으로 `git`처럼 **필기**에서 수정된 부분만 조리하는 방법도 생각할 수 있는데, 구현 난이도 상승 폭에 비해 얻을 수 있는 이점이 별로 없다. **필기** 하나에 속할 **지식**이 많아봐야 100개 내외로 예상되기 때문이다.
2. 서버단의 동작을 최대한 단순화하기 위함이다. 수정 쿼리가 존재하려면 서버 로직이 복잡해진다.

다만 장기적인 관점에서 이런 방식은 DB 사용량과 전체 통신량을 증가시키기 때문에, 향후 최적화될 필요는 있다.

수정이 없기 때문에, 사용자가 **필기**를 수정했을 때는 다음과 같이 처리한다.

1. 그 필기에 관련된 기존의 **지식**을 전부 삭제한다.
2. 새로운 **필기**가 조리한 **스프**의 **지식**을 전부 추가한다.
3. 서버에서 갱신된 **지식**들의 ID를 클라이언트로 보내, 문제가 없게끔 한다.



클라이언트에서 **토폴로지 메시지**를 만드는 방법은 다음과 같다. 평범한 DFS를 수행한 것.

```pseudocode
Let out = {
	infos: [],
	connections: [],
	type: some string
}

function serialize(Info info):
	for child in info.childs:
		if child is not visited:
			out.infos += child
			serialize(child)
		if out.type is "add":
			out.connections += (index of info in out.infos, index of child in out.infos)
		
function create_message(Info[] roots):
	for root in roots:
		serialize(root)
	return out
```

통신 경량화를 위해, `del` 쿼리인 경우 `out.connections`에 원소를 추가하지 않는다. 필요없기 때문이다..



서버에서 **토폴로지 메시지**의 `add` 쿼리를 처리하는 방법은 다음과 같다.

```pseudocode
function process_message_add(TopologyMessage msg):
	Let indices := []
	for obj in msg.infos:
		insert obj to MongoDB
		get _id of obj and push _id to indices
	for pair in out.connections:
		MongoDB.update({"_id": indices[pair.first], 
			{$push: {"childs": indices[pair.second]}}})
		MongoDB.update({"_id": indices[pair.second],
			{$push: {"parents": indices[pair.first]}}})
```

`del` 쿼리는 다음과 같이 처리한다.

```pseudocode
function process_message_del(TopologyMessage msg):
	for obj in msg.infos:
		for p in MongoDB.find({"_id": obj._id}).parents:
			if p exists:
				MongoDB.update({"_id": p._id}, {$pull: {"childs": obj._id}})
		MongoDB.remove({"_id": obj._id})
```

