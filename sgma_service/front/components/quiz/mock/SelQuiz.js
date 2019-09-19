import React, { useState } from 'react'
import { Radio } from 'semantic-ui-react'

const SelQuiz = props => {
  const { statement, index, handleFn, choices } = props;
  const [checkedValue, setCheckedValue] = useState('');
  const handleChange = (e, { value }) => {
    setCheckedValue(value);
    handleFn(index, value);
  };
  return (
    <div className="mocktest-quest">
      <b>
        <span style={{ fontSize: "2em" }}>{index + 1}. </span>
      </b>
      <span className="mocktest-quest-sub">
        <br />
        <b>{statement}</b>
        <br />
        {choices.map((x, i) => {
          return (
              <span style={{ padding: ".5em 0", width: '100%' }} key={"sel-" + index + "-" + i}>
                <Radio
                  name={"sel" + index}
                  value={i.toString()}
                  checked={i.toString() === checkedValue}
                  onChange={handleChange}
                  label={x}
                />
              </span>
          );
        })}
      </span>
    </div>
  );
};

export default SelQuiz;
