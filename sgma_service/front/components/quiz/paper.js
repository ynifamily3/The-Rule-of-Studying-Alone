import React, { Component } from "react";
import QuizBox from "./quizbox"; // componet 묶음
import "../../css/quizbox/quiz.css";

class PaperComponent extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {
    // console.log("나 닫혀요");
  }

  render() {
    // 이 페이지는 문제를 모아놓는 종이같은걸 만들어야 한다.
    // 일단 div 로 나누어 놓겠다.
    const { quests } = this.props.problemData;
    console.log(quests); // 언마운트 될 때 재 렌더링한것 같음

    return (
      <div className="testPaper">
        {quests.map((quest, i) => (
          <QuizBox quest={quest} key={i} />
        ))}
      </div>
    );
  }
}

export default PaperComponent;
