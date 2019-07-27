# 문제(Quest)

```pseudocode
define Quest:
	String		type		// 1, 유형 {"binary", "selection", "short"} 중 1개
	String		statement	// 1, 지문
	String[]	choices		// +, 선택지
	String[]	answers		// +, 정답
```

**문제**(`Quest`)는 사용자가 풀어야 할 문제를 모델링한 것이다.

**문제**의 지문은 사용자가 문제를 풀기 위해 필요한 정보를 서술한 문자열이다.

**문제**의 **선택지**는 사용자가 문제를 풀기 위해 할 수 있는 행동의 집합이다. **문제**의 유형별로 다음과 같이 정의한다.

* **참/거짓**(`"binary"`): `choices`는 불리언의 집합 {true, false}이 된다.
* **n지선다**(`"selection"`): `choices`는 $\mathcal{P}(\{1, 2, 3, \cdots, n\})$이다. 악랄한 문제의 경우, 주어진 어떤 선택지도 답이 아닐 수 있다. 이 경우 `answers`는 공집합이 되며 `[]`로 표현한다.
* **단답형**(`"short"`): 선택지는 문자열의 집합 전체다. 이렇게 무한한 선택지를 갖는 경우, `choices`는 `[]`로 정의한다.

**문제**의 **정답**은 사용자의 입력을 검증하는데 필요한 정보의 집합이다.

수학적으로 `choices`와 `answers`는 집합이지만, 실제 구현 시에는 처리를 용이하게 하기 위해 문자열 리스트로 인코딩한다. 예를 들어 **참/거짓** 유형의 선택지는 `["T"] 또는 ["F"]`로 표현할 수 있으며, **n지선다** 유형의 정답을 `["1", "4"]`로 표현할 수 있다.



# 하위지식 가져오기

어떤 **지식**의 하위지식을 반환한다. 평범한 DFS를 쓰면 된다. 전위탐색을 사용할 경우 주어진 주제로부터 가까운 지식이 리스트의 앞으로 오게 된다. 아래의 의사코드는 전위탐색으로 `g`의 하위지식을 `I`에 저장한다.

```pseudocode
Let I := [] be the set of subinfos
function fetch_subinfos(Info g):
	foreach i in childs of g:
		if i is not visted:
			I += i
			fetch_subinfos(cg)
	return I
```

구현 시 중복체크를 용이하게 하기 위해 `Info`에 정수 ID를 기록해두고, 해시셋으로 중복여부를 관리하는 것이 좋다.



# 문제생성

## 참/거짓(Binary)

주어진 **지식** `i`로 참/거짓 고르기 문제를 만든다. 만약 지문에 사용할 속성을 다른 지식에서 가져올 경우, 그 속성이 `i`의 속성 중 일부와 동치여서는 안된다. 만약 `i`의 속성을 변조할 경우, 확실하게 거짓임이 보장되는 형태로 변조해야 한다.

두 속성이 서로 동치인지 정확히 구분하는 것은 매우 어렵다. 하지만 문장의 의미는 잠시 내려두고, 문장을 이루는 단어의 구성이나 생김새로 유사 여부를 판단할 수는 있다. 만약 높은 유사성을 보인다면 그 속성을 선택하지 않으면 된다.

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
function generate_binary_quest(Info g):
	Select material ~ fetch_subinfos(g)
	Select r ~ [0, 1]
	// 50%의 확률로 답이 T 또는 F이다.
	if r > 0.5:
		ans := true
		fact := select_positive_attr(material)
	else:
		ans := false
		// 50%의 확률로 다른 지식의 속성을 가져오며
		// 나머지 50%의 확률로 기존의 속성을 변조한다
		r ~ [0, 1]
		if r > 0.5:
			fact := select_negative_attr(material)
		else:
			fact := mutate_attr(select_positive(material))
	Select name ~ material.names
	return {
		statement: "다음 문장의 참 거짓을 판별하시오.\n{name}은(는) {fact}",
		type: "binary",
		choices: [true, false],
		answers: [ans]
	}
	
// 지식 i에서 올바른 속성을 선택한다.
function select_positive_attr(Info material):
	Select attr ~ material.attrs
	return attr

// 지식 g에 있는 직속하위지식 중 지식 material와 충돌하지 않는 속성을 선택한다.
function select_negative_attr(Info g, Info material):
	Let H := fetch_subinfos(g) - {material}
	Let F := {h ∈ H : ∀a∈material.attrs ￢(h ≡ a)}
	Select attr ~ F
	return attr
```



## n지선다

`selection` 타입의 `Quest`는 n개의 선택지 중 a개의 정답을 모두 고르는 문제이다. 다양한 방식으로 문제를 출제할 수 있는데, 몇 가지 빈출유형을 관찰하면 다음과 같다.

* 1형: 하나의 **지식**에 대한 설명으로 옳은/옳지 않은 것 고르기 (ex: 다음 중 S.A.T.8에 대한 설명으로 옳지 않은 것을 고르시오.)
* 2형: 여러 개의 **지식**에 대한 설명으로 옳은/옳지 않은 것 고르기 (ex: 다음 중 샷건에 대한 설명으로 옳은 것을 고르시오.)

가장 쉬운 경우인 1형에서 '옳은 것'을 고르는 문제를 생각하자. **소재**(`material`)란 문제에서 정답의 기준이 되는 **지식**이다. 옳은 것을 고르는 경우 정답은 **소재**의 **속성**에 속해야 하며, 옳지 않은 경우 그 반대가 된다.

이때 답이 아닌 선택지는 크게 두 가지로 나뉜다.

* 부정형: **소재**의 속성에 논리적으로 반하는 속성
* 무관형: **소재**와는 관계가 없는 속성

부정형은 다른 **지식**의 **속성**에서 가져오거나, **소재**가 가진 **속성**을 뒤틀어서 얻을 수 있다. 이때 **소재**가 가진 **속성**과 논리적으로 어긋나야 하는데, 참/거짓 유형에서 논했던 것과 같은 방식을 사용한다.

무관형은 **소재**를 제외한 나머지 지식의 **속성** 중, 부정형이 아닌 것에 해당한다.

'옳지 않은 것'을 고르는 경우는 위와 동일하나 정답이 부정형/무관형이라는 점이 다르다.

```pseudocode
// g: 문제를 출제할 지식
// n: 선택지의 수
// a: 정답 선택지의 수
// inv: 옳은/옳지않은 트리거
function generate_selection_quest(Info g, Number n, Number a, Boolean inv):
	Let p be the number of required attributes of material
	if inv is false:
		p := a
	else:
		p := n - a
		
	// 정답 선택지 만들기
	Let material := select random Info having attribute more than p
	Let pos := []
	for i := 1, 2, ..., p:
		pos += select_positive_attr(material)
	
	// 오답 선택지 만들기
	Let neg := []
	for i := 1, 2, ..., n - p:
		Select r ~ [0, 1]
		if r > 0.5:
        // 변조
        	neg += mutate_attr(select_positive_attr(material))
		else:
        // 다른 지식에서 가져오기
            neg += select_negative_attr(material)
	
	// 선택지 만들기
	Let choices := pos + neg
	Shuffle choices
	Let answers := NULL
	if inv is false:
		answers := indices of elements of pos in choices
	else:
		answers := indices of elements of neg in choices
	
	// 표현
	Let logic_label be the string indicating inv
	if inv is false:
		logic_label := "옳은 것"
	else:
		logic_label := "옳지 않은 것"
	Select name ~ material.names
	
	return {
		statement: "다음 중 {name}에 대한 설명으로 {logic_label}을 고르시오.",
		type: "selection",
		choices: choices,
		answers: answers
	}
```



## 단답형

`short` 타입의 `Quest`는 지문에 있는 **속성**을 보고 원래 **지식**의 이름을 맞추는 유형이다.

지문으로 주어지는 **속성**의 수가 지나치게 적을 경우, 같은 **속성**을 공유하는 서로 다른 **지식** 조합이 있을 수 있다. 엄밀하게 출제하려면 특정 주제 내에서 속성 중복 여부를 검사해야하지만, **속성** 수를 충분하게(n >= 3?) 준다면 걱정하지 않아도 된다.

단답형은 참/거짓이나 n지선다와는 다른 채점방식을 사용한다. 참/거짓은 `answers`가 항상 1개의 원소만 가지고 있고, n지선다에선 `answers`에 있는 모든 원소를 다 골라야 정답으로 처리한다. 반면 단답형은 `answers`에 있는 원소 중 하나만 일치해도 정답으로 처리할 수 있다.

띄어쓰기가 포함돼 있는 문제의 경우, 주제나 상황에 따라 다르게 처리한다. 만약 띄어쓰기가 중요시되는 상황에선 엄격히 채점을 하면 되고, 띄어쓰기가 중요하지 않은 상황에는 공백을 모두 삭제한 뒤 채점하면 된다.

```pseudocode
// g: 문제를 출제할 지식
// n: 지문에 보여줄 속성의 수
function generate_short_quest(Info g, Number n):
	Select material ~ fetch_subinfos(g)
	Let attrs := []
	for p := 1, 2, ..., n:
		attrs += select_positive_attr(material)
	return {
		statement: "다음이 설명하는 것을 적으시오.\n{attrs[1], attrs[2], ...}",
		type: "short",
		choices: null,
		answers: material.names
	}
```



# 채점

**채점**(Evaluation)은 (문제, 사용자입력)의 쌍을 입력으로 받아서 [0, 1]의 실수를 출력하는 서브 프로그램이다. 이때 출력은 문제를 얼마나 완전히 풀었는지를 나타내며, 필요에 따라 정수만 사용할 수 있다. (가령 교수가 부분점수를 인정하는 경우와 그렇지 않은 경우...)

**채점**은 문제의 **유형**에 맞게 구현되어야 한다. 다양한 디자인 패턴으로 짤 수 있는데, 여기서는 스트래터지 패턴을 사용한다.

```pseudocode
// quest: 사용자가 풀려고 하는 문제
// response: 사용자의 응답을
function evaluate(Quest quest, String[] response):
	return Evaluator.get_evaluator(quest.type).evaluate(quest, response)
```



## 참/거짓 채점

응답은 반드시 하나밖에 없으므로 같은 문자열을 가지는지만 확인하면 된다.

```pseudocode
function BinaryEvaluator::evaluate(Quest quest, String[] response):
	if length(response) ≠ 1:
		return false
	else:
		return quest.answers[1] = response[1]
```



## n지선다 채점

문제에서 요구하는 모든 선택지가 포함돼 있어야 한다.

```pseudocode
function SelectionEvaluator::evaluate(Quest quest, String[] response):
	if length(quest.answers) ≠ length(response):
		return false
	sort quest.answers, response in lexiographical order
	for i := 1, 2, ..., length(quest.answers):
		if quest.answers[i] ≠ response[i]:
			return false
	return true
```



## 단답형 채점

문제에서 요구하는 선택지 중 하나만 만족해도 좋다. 일반적으로는 응답을 하나로만 제한하지만 향후 필요에 따라 수정할 여지는 있다.

```pseudocode
function ShortEvaluator::evaluate(Quest quest, String[] response):
	if length(response) ≠ 1:
		return false
	for i := 1, 2, ..., length(quest.answers):
		if quest.answers[i] = repsonse[1]:
			return true
	return false
```

