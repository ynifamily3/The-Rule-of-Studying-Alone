import React, { useState } from "react";
import { Radio, Image } from "semantic-ui-react";

const SelQuiz = props => {
  const {
    statement,
    index,
    handleFn,
    choices,
    title,
    solveState,
    answer
  } = props;
  const [checkedValue, setCheckedValue] = useState("");
  // const [solveState, setSolveState] = useState(0); // 0 : 채점 안 함, 1 : 맞음, 2 : 틀림
  const handleChange = (e, { value }) => {
    setCheckedValue(value);
    handleFn(index, value);
  };
  return (
    <div className="mocktest-quest" style={{ width: "100%" }}>
      {solveState !== 0 && (
        <div
          style={{
            position: "absolute",
            background:
              solveState === 1
                ? "transparent url(/static/img/correct.png) no-repeat"
                : "transparent url(/static/img/wrong.png) no-repeat",
            backgroundSize: "128px 128px",
            width: "128px",
            height: "128px",
            transform:
              solveState === 1
                ? "translate(-50%, -50%)"
                : "translate(-40%, -40%)",
            zIndex: "300"
          }}
        />
      )}
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
                readOnly={solveState !== 0}
              />
            </span>
          );
        })}
        <span
          style={{
            color: "red",
            textAlign: "right",
            padding: ".5em 0",
            width: "100%"
          }}
        >
          {solveState !== 0  ? `정답 : ${answer * 1 + 1}` : `ㅤ`}
        </span>
      </span>
    </div>
  );
};

SelQuiz.defaultProps = {
  solveState: 0
};

export default SelQuiz;
