import React, { useState } from "react";
import { Radio } from "semantic-ui-react";

const TFQuiz = props => {
  const { statement, index, handleFn, title, solveState } = props;
  const [checkedValue, setCheckedValue] = useState("");
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
            transform: solveState === 1 ? "translate(-50%, -50%)" : "translate(-40%, -40%)",
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
          {statement}
        </span>
        <br />
        <span>
          <Radio
            label="[ 참 ]"
            name={"tf" + index}
            value="T"
            checked={"T" === checkedValue}
            onChange={handleChange}
            readOnly={solveState !== 0}
          />
        </span>
        <br />
        <span>
          <Radio
            label="[ 거짓 ]"
            name={"tf" + index}
            value="F"
            checked={"F" === checkedValue}
            onChange={handleChange}
            readOnly={solveState !== 0}
          />
        </span>
      </span>
    </div>
  );
};

TFQuiz.defaultProps = {
  solveState: 0
};

export default TFQuiz;
