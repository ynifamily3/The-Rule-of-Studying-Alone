import Page from "../layouts/main";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";

class Test extends Component {
  increment() {
    this.props.store.dispatch(increase(1));
  }
  render() {
    const { counter } = this.props;
    return (
      <Page>
        <h1>리덕스 테스트 (카운터)</h1>
        <h2>{counter.number}</h2>
        <Button onClick={this.increment}>+</Button>
        <Button>-</Button>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

export default connect(mapStateToProps)(Test);
