import React from "react";
import { Checkbox } from "semantic-ui-react";

const TFQuiz = props => {
  const { answers, choices } = props;
  return choices.map((x, i) => {
    return (
      <>
        <Checkbox radio label={x} value={i} key={i} />
        <br />
      </>
    );
  });
};

export default TFQuiz;
