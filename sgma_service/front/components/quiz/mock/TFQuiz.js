import React, { useState } from 'react'
import { Radio } from 'semantic-ui-react'

const TFQuiz = props => {
  const { statement, index, handleFn } = props;
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
        <b>다음 문장의 참/거짓을 판별하시오.</b>
        <br />
        <span className="mocktest-stmt">{statement}</span>
        <br />
        <span>
          <Radio
            label='[ 참 ]'
            name={"tf" + index}
            value='T'
            checked={'T' === checkedValue}
            onChange={handleChange}
          />
        </span>
        <br />
        <span>
          <Radio
            label='[ 거짓 ]'
            name={"tf" + index}
            value='F'
            checked={'F' === checkedValue}
            onChange={handleChange}
          />
        </span>
      </span>
    </div>
  );
};

export default TFQuiz;
