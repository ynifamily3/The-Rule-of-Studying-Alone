# DB 1강

## File System vs Database

* 파일 시스템만으로도 데이터 관리를 할 수는 있다.
* 데이터베이스가 훨씬 더 많고 효율적인 기능을 제공한다.

### 원자성(Atomicity)

* 처리에 대한 결과가 더이상 쪼갤 수 없는 단위로 처리되어야 한다.
* ALL OR NOTHING

### 일관성(Consistency)

* 상태에 관계없이 동일한 조작에 대해 동일한 결과를 낼 것

## 스키마(Schema)

- 데이터베이스의 논리적/물리적 구조

- 프로그래밍 언어의 자료형과 비슷한 것

## 인스턴스(Instance)

- 어떤 시점에서 어떤 스키마의 특정 값
- 레코드(Record)라고 하기도 한다.

- 프로그래밍 언어의 변수와 비슷한 것



## 데이터 추상화(Data Abstraction)

* 사용자 수준에 따라서 중요한 부분과 부수적인 면을 분리하는 것
* 업무 효율을 높여준다

### Physical Level

* 레코드를 물리적으로 저장하는 방식을 기술한 것
* 가장 복잡하다

### Logical Level

* 저장하는 데이터 구조 및 데이터 간의 관계를 기술한 것

### View Level

* 사용자에 알맞은 데이터만 나타내도록 하는 것
* 보안과도 밀접한 연관
* 가장 단순하다

## Data Independence

### Physical Data Independence

* 논리 스키마를 변경하지 않고 물리 스키마를 변경할 수 있어야 함

### Logical Data Independence

* 물리 스키마를 변경하지 않고 논리 스키마를 변경할 수 있어야 함

## Data Model

중요함

* 데이터 그 자체
* 데이터 간의 관계

### Relational Data Model

* 데이터 간의 관계로 실세계를 보는 것
* 테이블(Table)에 속성(Attribute)으로 이루어진 레코드(Record)를 다룸
* ex) 학생-학번,이름,학과 등...

### Object-Relational Data Model

* 관계형 모델에 객체지향적 개념을 얹은 것
* 표현력이 풍부하다(Expressive Power)

### Object-Oriented Data Model

### Entity-Relationship Data Model

* 데이터베이스 설계에 사용하는 모델

### Semi-Structured Data Model

* ex) XML
* 방대해지는 웹데이터를 체계적으로 기술하기 위해 등장
* www 컨소시움에서 제안

### Hierarchical Data Model

### Network Data Model

## Database System

### Database Language

* 사용자가 DB에 저장된 정보에 접근하기 위해 필요한 언어
* 이 언어를 사용하여 원하는 정보를 기술한 것을 쿼리(Query)라고 부른다
* 가장 대중적인 언어는 SQL이다
* ex) SELECT NAME FROM PROFESSOR WHERE PID = '22222';

### Database Components

* Query Processor: 쿼리문을 처리하는 부분
* Storage Manager: 데이터를 입출력하는 부분
* 결론: 데이터베이스는 매우 복잡하다

### Data Dictionary

* 데이터를 저장한 것

* 메타데이터(Metadata)도 저장한다. (스키마, 무결정 제약, 권한, 질의통계 등)

### Transaction Management

* 질의문의 연속
* 한 번에 처리되어야할 DB의 연산 단위

### Database Users

#### Database Administrator (DBA)

* 스키마를 정의
* 데이터베이스 시스템을 총괄하는 관리자

## Database System Architecture

* Centralized
* Distributed
* Client-Server
* Parallel

## 데이터베이스의 역사

### 1950 ~ 1960

* 자기 테이프, 천공카드: 순차접근만 가능
* 하드디스크: 임의접근(Random Access) 가능

### 1970

- 데이터 모델로 네트워크 구조, 계층적 구조 모델을 많이 썼음. 
- 80년대 중반 E. Codd가 ER모델 제안

### 1980

* 상업용 DBMS 개발
* 객체지향 데이터베이스 등장

### 1990

* 데이터마이닝
* 데이터 웨어하우징
* 상업용 웹

### 2000

* 웹기술의 고도화

* XML 표준 제정

### 2010

* 빅데이터
* 극도로 방대한 양의 데이터 사용