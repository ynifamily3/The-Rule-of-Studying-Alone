# 개요

이 문서는 알고리즘에 관한 여러가지 문제점을 정리하는 곳이다.



# 스프 관련

## 말단 노드에 쓸데없이 지식과 같은 이름의 주제가 생기는 현상

현재 파싱 알고리즘에 의하면, 지식이 되어야 할 노드도 최초에는 주제로 생성된 후, 그 주제의 지식으로 편입된다. 예컨데 사용자가 다음과 같은 필기를 입력했다고 가정하자.

```
# A
* a
## B
* b1
* b2
## C
* c1
* c2
```

현재 알고리즘으로 이를 파싱하면 다음과 같은 스프가 나온다.

```
<A>
	[A]
		* a
	<B>
		[B]
			* b1
			* b2
	<C>
		[C]
			* c1
			* c2
```

이런 상황에서 `<B>`와 `[B]`를 구분할 필요가 있을까? 지식 `[B]`와 지식 `[C]`의 그래프 상 거리는 4촌 관계지만, 원래 사용자가 입력한 필기의 의도로 따지면 2촌 관계가 나와야 한다. 그렇다고 무작정 말단 노드를 지식으로만 만들면 다음과 같은 문제가 발생한다.

```
<A>
	[A]
		* a
	[B]
		* b1
		* b2
	[C]
		* c1
		* c2
```

지식 `[A]`와 지식 `[B], [C]`는 동등한 선상에 놓여있지 않아야 하지만, 스프 상으로는 동등한 수준의 지식으로 보인다. 이쯤해서 생각할 수 있는 것은 **주제와 지식을 구분해야만 하는가?**라는 것이다.

```
[A]
	* a
	[B]
		* b1
		* b2
	[C]
		* c1
		* c2
```

이렇게 깔끔하게 정리하면 되는거 아닌가 싶기도 하다. 하지만 이렇게 하면, **지식**이라는 하나의 클래스가 지나치게 다양한 형태로 존재할 수 있다는 문제가 생긴다. 과목도 지식이 될 수 있고, 폴더도 지식이 될 수 있고...



# 문제 생성 관련

## 부정속성(`negative_attr`)을 가져올 때, 포괄적인 주제의 직속자식 속성을 가져오면 생기는 부작용

다음과 같은 스프가 있다고 생각하자.

```
<AR>
	[AR]
		* 평균적인 사속을 갖는다
	<M4A1>
		[M4A1, 혐포, 시나몬포]
			* Anti-rain 소대의 리더이다.
			* 시나몬롤을 싫어한다.
		[설한의 쐐기]
			* 존나 아프다
	<M4 SOPMOD II>
		[M4 SOPMOD II, 솦모챠]
			* 미쳤다
			* Anti-rain 소대의 막내이다.
<SG>
	[SG]
		* 장갑이 있다.
```

M4A1은 AR의 하위주제이기 때문에, AR이 가진 속성이 적용될 수 있다. 때문에 거짓속성으로 [AR]로부터 가져오면, 답이 존재하지 않는 문제가 만들어질 수 있다.

```
(AR문제) 다음 중 SOPMOD에 대하여 옳지 않은 것을 고르시오.
1. 미쳤다.
2. Anti-rain 소대의 막내이다.
3. 평균적인 사속을 갖는다. <---- 답이지만, 상식적으로는 답이 아님
```

그렇다면, 무작정 같은 깊이에 있는 주제에서 오답을 가져와야만 하는가? 아래 문제는 다른 깊이에 있는 지식의 속성을 가져왔음에도 답이 존재한다.

```
(AR문제) 다음 중 M4A1에 대하여 옳지 않은 것을 고르시오.
1. Anti-rain 소대의 리더이다.
2. 시나몬롤을 싫어한다.
3. 장갑이 있다. <---- 답
```

첫 번째 해결 방법은 M4A1이 속한 주제의 '하위 주제'에서만 속성을 가져오는 것이다. 대신 그만큼 문제의 돌발성은 낮아지게 된다.

두

상위주제와 하위주제간의 속성 연계성 등은 필기를 작성한 사람에 따라 천차만별이다. 단순히 그래프 상에서 정점 간 거리만 가지고 판단할 수는 없다.