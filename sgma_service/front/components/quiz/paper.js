/*
props => soup (soup)
problems => defaultValue : 2
*/

import React, { Component } from "react";

import QuizBox from "./quizbox"; // componet 묶음
/*
import TFQuiz from "./tfquiz"; // component
import SelectionQuiz from "./selectionquiz";
import ShortQuiz from "./shortquiz";
*/

const Quest = require("../../libs/md-2-tree/quest");

class PaperComponent extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}

  /*
	Quest 쓰는 방법

	1. 문제 만들기
	let quest = Quest.{만들고 싶은 문제에 해당하는 생성 함수}([인자])
	quest.statement	// 지문
	quest.choices	// 선택지로 보여줄 문자열 집합
	quest.answers	// 정답

	2. 문제 매기기
	boolean Quest.evaluate(quest, response)

	3. 참/거짓 문제
	Quest Quest.generate_binary_quest(Info g);

	참/거짓 문제의 response는 ['T'] 또는 ['F'] 여야 한다.
	
	4. n지선다 문제
	Quest Quest.generate_selection_quest(Info g, int n, int a, boolean inv)
		n: 선택지 수
		a: 골라야 하는 답의 수
		inv: 참이면 '옳지 않은 것', 거짓이면 '옳은 것'

	n지선다 문제의 response는 ['0', '3', ...], 즉 음이 아닌 정수를 나타낸
	문자열의 집합이어야 한다.

	5. 단답형 문제
	Quest Quest.generate_short_quest(Info g, int n);
		n: 주어지는 정보 수

	이 이외의 함수는 건드렸을 때 책임 안짐
*/

  render() {
    // 이 페이지는 문제를 모아놓는 종이같은걸 만들어야 한다.
    // 일단 div 로 나누어 놓겠다.
    const { soup, problems } = this.props;

    // 여기서 주어진 문제 개수만큼 생성할 수 있다.
    const numOfProblems = problems ? problems : 2; // 문제 개수만큼 생성한다. (아 반복문은 싫은데 ㅡㅡ)
    let quests = []; // 함수형이 아니지만 편의를 위하여 다음과 같이 문제를 생성한다.
    for (let i = 0; i < numOfProblems; i++) {
      let salt = Math.random();
      // Math. random 적용해서 문제를 만들어야 한다. 지금 개발 단계에서는 이지선다로 만든다.
      if (salt < 0.3333)
        quests.push({ q: Quest.generate_binary_quest(soup.roots[0]), type: 0 });
      else if (salt >= 0.3333 && salt < 0.6666)
        quests.push({
          q: Quest.generate_selection_quest(soup.roots[0], 4, 1, false),
          type: 1
        });
      else
        quests.push({
          q: Quest.generate_short_quest(soup.roots[0], 2),
          type: 2
        });
    }
    return (
      <div className="testPaper">
        {quests.map((quest, i) => (
          <QuizBox quest={quest.q} type={quest.type} key={i} />
        ))}
      </div>
    );
  }
}

export default PaperComponent;
