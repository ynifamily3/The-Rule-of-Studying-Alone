import Page from "../layouts/main";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { increment } from "../reducers";
class Test extends Component {
  incrementClick = () => {
    // const { incrementCount } = this.props
    alert("증가");
    increment();
  };

  decrementClick = () => {};

  render() {
    //const { members } = this.props;
    const { incrementClick, decrementClick } = this;
    return (
      <Page>
        <h1>리덕스 테스트 (카운터)</h1>
        <h2>{this.props.number}</h2>
        <Button onClick={incrementClick}>+</Button>
        <Button onClick={decrementClick}>-</Button>
      </Page>
    );
  }
}
function mapStateToProps(state) {
  return {
    number: state.number
  };
}
const mapDispatchToProps = dispatch => ({
  handleClick: () => dispatch(increment())
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);
