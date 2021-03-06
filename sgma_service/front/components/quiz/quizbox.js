import React from "react";
import TFQuiz from "./tfquiz";
import SelectionQuiz from "./selectionquiz";
import ShortQuiz from "./shortquiz";
import { Segment, Form } from "semantic-ui-react";

const QuizBox = props => {
  const { statement, answers, choices, type, title } = props.quest;
  let willRender;
  switch (type) {
    case "binary":
      willRender = <TFQuiz answers={answers} choices={choices} />;
      break;
    case "selection":
      willRender = <SelectionQuiz answers={answers} choices={choices} />;
      break;
    case "short":
      willRender = <ShortQuiz answers={answers} choices={choices} />;
    default:
      willRender = <ShortQuiz answers={answers} choices={choices} />;
      break;
  }
  return (
    <Segment raised>
      <div className="problem-title">
        <p>{title}</p>
        <p>{statement}</p>
      </div>
      <Form.Field>{willRender}</Form.Field>
    </Segment>
  );
};

export default QuizBox;
