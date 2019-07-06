# 용어 및 변수명 컨벤션

모든 클래스 명은 대문자로 시작한다.

```javascript
class A {
	...
}
```

여러 개의 원소를 포함할 수 있는 집합(ex: 배열, 맵, 트라이 등)의 레퍼런스는 반드시 s를 붙인다.

```javascript
class Foo {
    ...
}

class Bar {
	constructor() {
        this.root = new Foo();
        this.childs = [];
    }
}
```

이는 변수명 뿐만 아니라 문서에서 대상을 지칭할 때에도 동일하게 적용한다.

문서에서 어떤 클래스/집합에 속한 임의의 엔티티를 표현할 때는 `[[ClassName]]`을 사용한다.



# 주제(Group)

**주제**(`Group`)는 1개의 **이름**(`name`)과 0개 이상의 **자식주제**(`childgroups`), 0개 이상의 **지식**(`infos`)로 이루어진 단위 구조이다.

어떤 주제 A에서 B로 유한 번의 참조로 도달할 수 있을 때, B는 A의 **하위주제**(`subgroups`), A는 B의 **상위주제**(`supergroup`)라고 한다.

어떤 주제로부터 유한 번의 참조를 통해 도달할 수 있는 지식을, 그 주제의 **하위지식**(`subinfos`)이라 한다.

임의의 주제 G에 대하여, G는 자신의 어떤 하위주제에도 소속되어선 안된다. 즉, 그래프 상에서 순환이 발생해서는 안된다.`child`가 들어가서 마치 트리처럼 보일 수도 있지만, 하나의 주제는 여러 주제의 자식주제가 될 수 있기 때문에 트리가 아닌 **DAG**(Directed Acylic Graph)를 형성한다.



# 지식(Info)

**지식**(`Info`)은 1개 이상의 **이름**(`names`)과 1개 이상의 **속성**(`attrs`)으로 이루어진 단위 구조이다. 어떤 지식과 그 지식의 이름, 속성에 대하여 명제 *"[[이름]]은/는 [[속성]]이다"*는 참이어야 한다.



# 문제(Quest)

문제(`Quest`)는 1개의 **유형**(`type`), 1개의 **지문**(`statement`), 1개 이상의 **선택지**(`choices`), 1개 이상의 **정답**(`answers`)로 이루어진 단위 구조이다.

* **참/거짓**(`"binary"`): `choices`는 불리언의 집합 {true, false}가 된다.

* **n지선다**(`"selection"`): `choices`는 $\mathcal{P}(\{1, 2, 3, \cdots, n\})$이다. 악랄한 문제의 경우, 주어진 어떤 선택지도 답이 아닐 수 있다. 이 경우 `answers`는 공집합이 된다.

* **단답형**(`"short"`): 선택지는 문자열의 집합 전체다. 이렇게 무한한 선택지를 갖는 경우, `choices`는 `null`로 정의한다.



# 그래프 조작 알고리즘

## 하위지식 가져오기

평범한 DFS를 쓰면 된다. 전위탐색을 사용할 경우 주어진 주제로부터 가까운 지식이 리스트의 앞으로 오게 된다. 아래의 의사코드는 전위탐색으로 `g`의 하위지식을 `I`에 저장한다.

```pseudocode
Let I := Φ be the set of subinfos
function fetch_subinfos(group g):
	foreach i in infos of g:
		if i is not visted:
			I := I ∪ {i}
	foreach cg in childgroups of g:
		if cg is not visted:
			fetch_subinfos(cg)
```

구현 시 중복체크를 용이하게 하기 위해 `Group`과 `Info`에 정수 ID를 기록해두고, 해시셋으로 중복여부를 관리하는 것이 좋다.



