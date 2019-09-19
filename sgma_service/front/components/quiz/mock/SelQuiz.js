const SelQuiz = props => {
  const { statement, index, handleFn, choices } = props;
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
        <b>{statement}</b>
        <br />
        {choices.map((x, i) => {
          return (
            <label htmlFor={"sel" + i} style={{ padding: ".5em 0", width:'100%' }} key={"sel-" + index + "-" + i}>
              <span>
                <input
                  type="radio"
                  id={"sel" + i}
                  name={"sel" + index}
                  value={i}
                  onChange={handleChange}
                />{" "}
                {x}
              </span>
            </label>
          );
        })}
      </span>
    </div>
  );
};

export default SelQuiz;
