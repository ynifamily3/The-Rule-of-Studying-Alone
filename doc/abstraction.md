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

### 순환 예방하기

원칙적으로는 주제에 새로운 자식주제를 추가할 때 순환이 생기는지 확인해야 한다. 깊이우선탐색(DFS)을 수행하면 순환이 존재하는지 쉽게 판단할 수 있으나, 최악의 경우 데이터베이스의 전체를 다 뒤져봐야 할 수 있다. 따라서, 애초부터 사용자가 선택할 대상을 제한하는 것이 좋다.

보통 사용자들은 자신이 가지고 있는 자료(ex: 교수님이 주신 프린트, 족보 등)만을 기반으로 주제를 입력할 것이다. 때문에 자신이 입력한 적이 없는 지식은 굳이 사용자에게 보여줄 필요가 없다. 설사 그게 가능하더라도 대다수의 사용자들은 그 기능을 사용하지 않을 것이다. 복잡하고 귀찮은 것에 비해서 얻을 수 있는 것이 없기 때문이다.

이를 쉽게 통제하는 방법은, 사용자가 **과목**(`subject`)을 만든 뒤 주제를 추가하도록 유도하는 것이다. 사실 과목은 프로그래밍적으로는 주제에 불과하다. 단지 서비스 상에서 표시할 때만 주제와는 다르게 하는 것 뿐이다. 과목은 상위주제가 루트인 것으로 판단하면 된다.



# 지식(Info)

**지식**(`Info`)은 1개 이상의 **이름**(`names`)과 1개 이상의 **속성**(`attrs`), 1개 이상의 **소속주제**(`basegroups`)으로 이루어진 단위 구조이다. 어떤 지식과 그 지식의 이름, 속성에 대하여 명제 *"[[이름]]은/는 [[속성]]이다"*는 참이어야 한다.



# 문제(Quest)

문제(`Quest`)는 1개의 **유형**(`type`), 1개의 **지문**(`statement`), 1개 이상의 **선택지**(`choices`), 1개 이상의 **정답**(`answers`)로 이루어진 단위 구조이다.

* **참/거짓**(`"binary"`): `choices`는 불리언의 집합 {true, false}가 된다.
* **n지선다**(`"selection"`): `choices`는 $\mathcal{P}(\{1, 2, 3, \cdots, n\})$이다. 악랄한 문제의 경우, 주어진 어떤 선택지도 답이 아닐 수 있다. 이 경우 `answers`는 공집합이 된다.
* **단답형**(`"short"`): 선택지는 문자열의 집합 전체다. 이렇게 무한한 선택지를 갖는 경우, `choices`는 `null`로 정의한다.



# 알고리즘

## 하위지식 가져오기

평범한 DFS를 쓰면 된다. 전위탐색을 사용할 경우 주어진 주제로부터 가까운 지식이 리스트의 앞으로 오게 된다. 아래의 의사코드는 전위탐색으로 `g`의 하위지식을 `I`에 저장한다.

```pseudocode
Let I := Φ be the set of subinfos
function fetch_subinfos(Group g):
	foreach i in infos of g:
		if i is not visted:
			I := I ∪ {i}
	foreach cg in childgroups of g:
		if cg is not visted:
			fetch_subinfos(cg)
	return I
```

구현 시 중복체크를 용이하게 하기 위해 `Group`과 `Info`에 정수 ID를 기록해두고, 해시셋으로 중복여부를 관리하는 것이 좋다.



## 참/거짓 문제 생성

주어진 지식 `i`로 참/거짓 고르기 문제를 만든다. 만약 지문에 사용할 속성을 다른 지식에서 가져올 경우, 그 속성이 `i`의 속성 중 일부와 동치여서는 안된다. 만약 `i`의 속성을 변조할 경우, 확실하게 거짓임이 보장되는 형태로 변조해야 한다.

두 속성이 서로 동치인지 정확히 구분하는 것은 매우 어렵다. 하지만 문장의 의미는 잠시 내려두고, 문장을 이루는 단어의 구성이나 생김새로 유사 여부를 판단할 수는 있다. 만약 높은 유사성을 보인다면 그 속성은 버리면 선택하지 않으면 된다.

```
속성 a: 회피가 매우 높은 SMG이다.
속성 b: SMG 중 회피가 높은 편이다.
속성 c: SMG에서 체력이 높다.
속성 d: 귀여운 샷건이다.
```

속성 a, b가 문자열 `SMG`, `회피`, `높은`을 공유하는 반면 a, c는 `SMG`, `높`만 공유하며 a, d는 아무것도 공유하지 않는다. (사실 단어 높과 높은은 같은 뜻이지만, 이걸 구분하는 건 NLP의 영역이다) 아주 짧은 문장에서 3개가 겹칠 정도면 꽤 유사하다고 볼 수 있다. 2개가 겹치는 경우 확실하게 겹치는 건진 몰라도, 일단 선택지에서 제외하면 안전할 것이다.



변조를 구현하는 것은 자연어 처리의 영역이기 때문에, 본 프로젝트에서 적용 여부는 확실하지 않다. 다음과 같이 특수한 경우에 대해서 고려해볼 수는 있다.

* 사건의 날짜를 나타내는 문자열의 일부를 다른 숫자로 바꾼다.
* ~~하다와 ~~하지않다를 서로 바꾼다.

또는 속성을 입력할 때 특수한 메타 정보를 삽입하는 방식도 생각해 볼 수 있다. 하지만 사용자 편의적으로는 상당히 귀찮아서, 버려진 기능이 될 가능성이 크다.

```pseudocode
Let ans be the unique answer of this quest
Let fact be the proposition of this binary quest
function generate_binary_quest(Info i):
	// 50%의 확률로 참인 명제를 고른다 
	Select r ~ [0, 1]
	if r > 0.5:
		ans := true
		fact := select_positive(i)
	else:
		ans := false
		// 50%의 확률로 다른 지식의 속성을 가져오며
		// 나머지 50%의 확률로 기존의 속성을 변조한다
		r ~ [0, 1]
		if r > 0.5:
			fact := select_negative(i)
		else:
			fact := mutate_attr(select_positive(i))
	return {
		statement: "다음 문장의 참 거짓을 판별하시오.\n" + ,
		type: "binary",
		choices: [true, false],
		answers: [ans]
	}
	
// 지식 i에서 올바른 속성을 선택한다.
function select_positive(Info i):
	Select attr ~ i.attrs
	return attr

// 지식 i의 소속주제에서 다른 주제의 속성을 선택한다.
function select_negative(Info i):
	Let H := {h ∈ S.infos : S ∈ i.homegroups}
	Let F := {h ∈ H : ∀a∈i.attrs ￢(h ≡ a)}
	Select attr ~ F
	return attr
```

