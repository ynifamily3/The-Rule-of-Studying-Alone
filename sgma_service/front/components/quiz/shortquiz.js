import React, { useState } from "react";
import { Input } from "semantic-ui-react";

const ShortQuiz = props => {
  const [userInputValue, setUserInputValue] = useState("");
  return (
    <Input
      fluid
      placeholder="정답 입력..."
      value={userInputValue}
      onChange={e => {
        setUserInputValue(e.target.value);
      }}
    />
  );
};

export default ShortQuiz;
