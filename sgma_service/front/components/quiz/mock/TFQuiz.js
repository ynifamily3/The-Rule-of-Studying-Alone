const TFQuiz = props => {
  const { statement, index, handleFn } = props;
  const handleChange = e => {
    // alert(e.target.value);
    handleFn(index, e.target.value);
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
          <input
            id={"tf0" + index}
            name={"tf" + index}
            type="radio"
            value="T"
            onChange={handleChange}
          />
          <label htmlFor={"tf0" + index}>&nbsp;[ 참 ]</label>
        </span>
        <br />
        <span>
          <input
            id={"tf1" + index}
            name={"tf" + index}
            type="radio"
            value="F"
            onChange={handleChange}
          />
          <label htmlFor={"tf1" + index}>&nbsp;[ 거짓 ]</label>
        </span>
      </span>
    </div>
  );
};

export default TFQuiz;
