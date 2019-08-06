/*
props => soup (soup)
problems => defaultValue : 2
*/

import React, { Component } from "react";
import TFQuiz from "./tfquiz";
import SelectionQuiz from "./selectionquiz";
import ShortQuiz from "./shortquiz";

const Quest = require("../../libs/md-2-tree/quest");

class PaperComponent extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    // 이 페이지는 문제를 모아놓는 종이같은걸 만들어야 한다.
    // 일단 div 로 나누어 놓겠다.
    const { soup, problems } = this.props;

    // 여기서 주어진 문제 개수만큼 생성할 수 있다.
    const numOfProblems = problems ? problems : 2; // 문제 개수만큼 생성한다. (아 반복문은 싫은데 ㅡㅡ)
    let quests = []; // 함수형이 아니지만 편의를 위하여 다음과 같이 문제를 생성한다.
    for (let i = 0; i < numOfProblems; i++) {
      // Math. random 적용해서 문제를 만들어야 한다. 지금 개발 단계에서는 이지선다로 만든다.
      if (Math.random() % 2 < 0.5)
        quests.push(Quest.generate_binary_quest(soup.roots[0]));
      else
        quests.push(Quest.generate_selection_quest(soup.roots[0], 4, 1, false));
    }
    return (
      <div className="testPaper">
        {quests.map((quest, i) => {
          const { statement, answers } = quest;
          return (
            <div className="problem" key={i}>
              {statement.split("<br>").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <hr />
            </div>
          );
        })}
      </div>
    );
    /*
    return statement.split("<br>").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    )); // => br 태그를 실제 개행으로 처리함
    */
  }
}

export default PaperComponent;
