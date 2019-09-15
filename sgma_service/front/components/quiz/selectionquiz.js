import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";

const SelectionQuiz = props => {
  const { answers, choices } = props;
  let initState = [];
  for (let i = 0; i < choices.length; i++) initState.push(false);
  const [userInputChoices, setUserInputChoices] = useState(initState);
  return choices.map((x, i) => {
    return (
      <div key={i + Math.random()}>
        <Checkbox
          label={x}
          value={i}
          key={i}
          checked={userInputChoices[i]}
          onChange={(e, { checked }) => {
            let newState = [...userInputChoices];
            newState[i] = checked;
            setUserInputChoices(newState);
          }}
        />
        <br />
      </div>
    );
  });
};

export default SelectionQuiz;
