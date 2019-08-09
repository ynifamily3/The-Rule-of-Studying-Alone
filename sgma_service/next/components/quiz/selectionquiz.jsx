import React from "react";
import { Checkbox } from "semantic-ui-react";

const SelectionQuiz = props => {
  const { answers, choices } = props;
  return choices.map((x, i) => {
    return (
      <>
        <Checkbox label={x} value={i} key={i} />
        <br />
      </>
    );
  });
};

export default SelectionQuiz;
