/* 단답식 */

const ShortQuiz = props => {
  const { statement, index, handleFn } = props;
  const handleChange = e => {
    handleFn(index, e.target.value);
  };
  return (
    <div className="mocktest-quest">
      <b>
        <span style={{ fontSize: "2em" }}>{index + 1}. </span>
      </b>
      <span className="mocktest-quest-sub">
        <br />
        <b>다음이 설명하는 것을 적으시오.</b>
        <br />
        <span className="mocktest-stmt">
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
        <span>
          정답:{" "}
          <input
            id={"short" + index}
            name={"short" + index}
            onChange={handleChange}
            type="text"
            className="hongong-textarea"
          />
        </span>
        <br />
      </span>
    </div>
  );
};

export default ShortQuiz;
