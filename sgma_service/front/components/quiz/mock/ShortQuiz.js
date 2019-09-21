import React from 'react'
import { Input } from 'semantic-ui-react'

const ShortQuiz = props => {
  const { statement, index, handleFn, title } = props;
  const handleChange = e => {
    handleFn(index, e.target.value);
  };
  return (
    <div className="mocktest-quest" style={{width: '100%'}}>
      <b>
        <span style={{ fontSize: "2em" }}>{index + 1}. </span>
      </b>
      <span className="mocktest-quest-sub" style={{width: '100%'}}>
        <br />
        <b>{title}</b>
        <br />
        <span className="mocktest-stmt" style={{width: '100%'}}>
          {statement.split("\n").reduce((a, b) => {
            return (
              <span>
                {a}
                <br />
                {b}
              </span>
            );
          })}
        </span>
        <br />
        <span style={{width: '100%'}}>
          <Input id={"short" + index}
            fluid
            autoComplete={'off'}
            name={"short" + index}
            onChange={handleChange}
            placeholder='정답 입력...' />
        </span>
        <br />
      </span>
    </div>
  );
};

export default ShortQuiz;
