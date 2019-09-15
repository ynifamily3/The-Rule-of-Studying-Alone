# 모의고사 시스템 설계

## 모의고사

**모의고사(Mocktest)**란 1개 이상의 지식으로 생성된 충분한 수의 문제로 정의한다.

`모의고사`를 생성하기 위해서는 포레스트가 필요하다. (사용자에게 포레스트를 입력받는 방법은 `주제선정 UI에 대한 고찰.pptx`를 참고하기 바람)  입력받은 포레스트에서 최대한 균등하게 지식을 선택하여 문제를 생성하는 것이 바람직하다.

```pseudocode
define Mocktest:
	Quest[] quests   // +: 생성된 문제들
	
// types: 유형별 문제를 몇 개씩 낼 것인지 배열로 지정
function create_mocktest(Info[] infos, Number n, Number[] types):
	Let infos := Select n random infos from Soup.fetch_subinfos(infos)
	Let Q := []
	Let t := 0
	foreach I in infos:
		Q += create quest with I having its type as t
		types[t] -= 1
		if types[t] = 0:
			t += 1
	return new Mocktest(Q)
```



## 오답노트

사용자가 모의고사를 풀고 나면, 출제된 지식에 관한 문제의 정답률에 근거하여 부족한 지식이 무엇인지를 알려준다. 이것을 정리한 것을 **오답노트(ReviewNote)**라 정의한다. 오답노트는 일종의 모의고사에 대한 데코레이터로 볼 수 있다.

```pseudocode
define ReviewNote:
	Mocktest test	      // 1: 어떤 모의고사에 대한 결과인지
	String[] user_answers // size of test.quests: 응시자가 응답한 결과
	Info[]   used_infos   // test.infos에서 중복을 제외한 info들
	Number[] used_nums    // size of used_infos: used_infos[k]의 총출제수
	Number[] solved_nums  // size of used_infos: used_infos[k]의 총정답수
	Time     date_studied // 1: 모의고사를 응시한 날짜 및 시간, yyyy-mm-dd-hh
```

`오답노트`는 개별 사용자가 소유하며, 다른 사용자의 `오답노트`는 볼 수 없다.

`오답노트`를 DB에 저장할 때는 그 결과를 표현한 불변형 문자열을 저장한다. 즉, 사용자가 공부한 주제의 `스프`가 향후 변경되더라도 오답노트에 영향을 미치지 못한다.

이렇게 하는 이유는 스프를 DB에 저장하는 방식 때문이다. 2019년 8월 20일 기준으로 사용자가 `필기`를 수정할 경우, DB에 저장된 기존 `스프`가 삭제되고 새로운 `스프`로 대체된다. 만약 `오답노트`가 기존 `스프`를 참조할 경우, 존재하지 않는 값을 참조할 수 있다. 이를 방지하려면 `스프`를 변경할 때마다 수 천 명의 `오답노트`를 수정해야하며, 서로 다른 DAG의  `지식`을 어떤 기준으로 매핑시켜야하는지 분명하지 않다.

따라서 `오답노트`의 표현은 어떤 의존성을 갖지 못하도록 설계하였다.



### 습득률

예를 들어 다음과 같은 상황을 생각해보자.

```
<지식>
A
	B
		C
	D
		E

<문제 출제에 사용된 지식 통계>
지식명   출제수   정답수
A		1		1
B		5		3
C		4		4
D		3		2
E		4		1
```

어떤 분야를 제대로 암기하고 있는지의 여부는, 특정 지식의 하위 지식까지 포함하여 확인하는 것이 좋겠다.

모의고사에서 특정 지식의 **습득률(LearnedRate)**은 다음과 같이 정의한다.

```pseudocode
function learned_rate(Info info):
	return (info와 info의 하위지식이 사용된 문제 중 맞춘 문제의 수) / (info와 info의 하위지식이 사용된 문제의 수)
```

위 예시의 습득률을 구하면 다음과 같다.

```pseudocode
지식명   총출제수 총정답수  습득률
A		17		11		64.7%
B		9		7		77.77%
C		4		4		100%
D		7		3		42.85%
E		4		1		25%
```

상위/하위 지식간의 관계와 습득률간 특별한 수학적인 관계는 없으며, 그저 사용자가 직관적으로 어디를 더 공부해야하는지 알려주는 지표가 되기만 하면 된다.

#### 습득률 계산

습득률을 정의 그대로 사용해서 무식하게 구하면 $V$개의 지식에 대하여 최악의 경우 $O(V^2)$의 시간 복잡도가 소요될 수 있다. (a → b → c → d → e ... 처럼 연결된 스프를 생각해보자) 대신 위상정렬 알고리즘을 이용하여 직속하위지식으로부터 맞춘 문제 수를 누적시키면 $O(V + E)$의 시간 복잡도로 계산할 수 있다. 이때 `E`는 지식 간 연결의 수다.

알고리즘의 기본 원리는 그래프의 말단 노드부터 자식 지식의 총출제수와 노드 자신의 순수 출제수를 더하여 기록한다. 어떤 배열을 힙으로 만드는 알고리즘(Sift-up)과 유사하다. 위상정렬의 특성상 자식부터 계산을 하므로, 상위 노드는 하위 노드의 총 출제수를 $O(1)$로 참조할 수 있다.

```pseudocode
// unique_pairs: 모의고사에서 사용한 지식 별로 <지식, 순수출제수, 순수정답수>의 튜플들
function compute_learned_rate(<Info, Used_num, Solved_num>{} unique_pairs):
	Let used_infos := Do Topology-Sort based on unique_pair's first element
	Let used_nums := [1, 1, 1, ..., 1] as size of used_infos
	Let solved_nums := [0, 0, 0, ..., 0] as size of used_infos
	for k := 0, 1, ..., size of used_infos:
		for each used subinfo under used_infos[k]:
			used_nums[k] += subinfo's used_nums
			solved_nums[k] += subinfo's solved_nums
```

그런데 문제 출제에 사용된 `지식`은 과목의 전체 `스프`의 일부 정점이기 때문에, 서로의 전이적 관계(Transition)를 알 수가 없다. 따라서 사용된 `지식`들만 포함하는 서브그래프가 필요하다.

서브그래프를 추출하는 알고리즘은 다음과 같다.

```pseudocode
// 문제출제에 사용한 지식으로 서브그래프를 만들어 반환한다.
function extract_subgraph(Info[] roots):
	Let may_roots := []
	for root in roots:
		// find_transition의 최상단이 항상 루트를
		// 반환하지는 않는다. 먼저 반환한 결과값이
		// 나중에 어떤 자식이 될 수도 있기 때문이다.
		// 따라서 일단 다 저장한 뒤, 전체를 순회하면서
		// 루트가 아닌 것들은 빼야한다.
		may_roots += find_transition(root)
	return reduce may_roots by removing non-root nodes

// root에서 도달할 수 있는 사용한 지식만으로 연결된
// 노드들을 반환한다.
function find_transition(Info root):
	if root is cached:
		return cached childs
	Let new_childs := []
	for child in root.childs:
		new_childs += find_transition(child)
	Let result := NULL
	if root is used:
		result := [{origin: root, childs: new_childs}]
	else:
		result := new_childs
	cache result to the root
	return result
```


