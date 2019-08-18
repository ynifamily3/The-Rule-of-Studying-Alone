import React from "react";
import TFQuiz from "./tfquiz";
import SelectionQuiz from "./selectionquiz";
import ShortQuiz from "./shortquiz";
import { Segment, Form } from "semantic-ui-react";

const QuizBox = props => {
  const { statement, answers, choices } = props.quest;
  const { type } = props;
  let selectionComponent;
  switch (type) {
    case 0:
      selectionComponent = <TFQuiz answers={answers} choices={choices} />;
      break;
    case 1:
      selectionComponent = (
        <SelectionQuiz answers={answers} choices={choices} />
      );
      break;
    default:
      selectionComponent = <ShortQuiz answers={answers} choices={choices} />;
      break;
  }
  return (
    <Segment raised>
      <div className="problem-title">
        {statement.split("<br>").map((line, i) => {
          return (
            <span key={i + Math.random()}>
              {line}
              <br />
            </span>
          );
        })}
      </div>
      <Form.Field>{selectionComponent}</Form.Field>
    </Segment>
  );
};

export default QuizBox;
