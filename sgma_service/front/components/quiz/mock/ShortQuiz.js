import React from "react";
import { Input } from "semantic-ui-react";

const ShortQuiz = props => {
  const { statement, index, handleFn, title, solveState, answer } = props;
  const handleChange = e => {
    handleFn(index, e.target.value);
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
      <span className="mocktest-quest-sub" style={{ width: "100%" }}>
        <br />
        <b>{title}</b>
        <br />
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
        <br />
        <span style={{ width: "100%" }}>
          <Input
            id={"short" + index}
            fluid
            autoComplete={"off"}
            name={"short" + index}
            onChange={handleChange}
            placeholder="정답 입력..."
            readOnly={solveState !== 0}
          />
        </span>
        <span
          style={{
            color: "red",
            textAlign: "right",
            padding: ".5em 0",
            width: "100%"
          }}
        >
          {solveState !== 0 ? `정답 : ${answer}` : `ㅤ`}
        </span>
      </span>
    </div>
  );
};

ShortQuiz.defaultProps = {
  solveState: 0
};

export default ShortQuiz;
