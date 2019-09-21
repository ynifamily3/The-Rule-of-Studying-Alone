import React, { useState } from "react";
import { Radio, Image } from "semantic-ui-react";

const SelQuiz = props => {
  const { statement, index, handleFn, choices, title, solveState } = props;
  const [checkedValue, setCheckedValue] = useState("");
  // const [solveState, setSolveState] = useState(0); // 0 : 안품, 1 : 맞음, 2 : 틀림
  const handleChange = (e, { value }) => {
    setCheckedValue(value);
    handleFn(index, value);
  };
  return (
    <div className="mocktest-quest" style={{ width: "100%" }}>
      <div style={{ position: "absolute", backgroundImage: "url(/static/img/wrong.png)", backGroundSize: "12px 12px", width:'30px', height:'40px'}}>
        {" "}
      </div>
      <b>
        <span style={{ fontSize: "2em" }}>{index + 1}. </span>
      </b>
      <span className="mocktest-quest-sub">
        <br />
        <b>{title}</b>
        <br />
        {statement && (
          <span className="mocktest-stmt" style={{ width: "100%" }}>
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
        )}
        {choices.map((x, i) => {
          return (
            <span
              style={{ padding: ".5em 0", width: "100%" }}
              key={"sel-" + index + "-" + i}
            >
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
