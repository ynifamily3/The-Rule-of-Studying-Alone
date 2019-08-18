import React, { useState } from "react";
import { Form, Radio } from "semantic-ui-react";

const TFQuiz = props => {
  const { answers, choices } = props;
  const [value, setValue] = useState();
  // T와 F일 것이다.
  return (
    <Form>
      {choices.map((x, i) => {
        return (
          <Radio
            style={{ marginRight: "1em" }}
            key={i + Math.random()}
            label={x}
            name="TFGroup"
            value={x}
            checked={value === x}
            onChange={() => setValue(x)}
          />
        );
      })}
    </Form>
  );
};

export default TFQuiz;
