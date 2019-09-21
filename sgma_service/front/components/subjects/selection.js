import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { List, Segment, Loader, Dimmer } from "semantic-ui-react";
// import axios from "axios";

const SelectionComponent = props => {
  const { isLogin } = props;
  const subjectList = !isLogin
    ? []
    : useSelector(state => state.subjects).toJS().subjects; // reducer -> index.js -> rootReducer -> userinfo

  return (
    <List style={{ marginBottom: "20px", width: "58.5em" }}>
      {subjectList.length ? (
        subjectList.map((x, i) => {
          return (
            <List.Item key={"subject_name-".concat(i)}>
              <Link
                href={{
                  pathname: "dashboard",
                  query: { subject: x["subject_name"] }
                }}
              >
                <a>
                  <Segment>{x["subject_name"]}</Segment>
                </a>
              </Link>
            </List.Item>
          );
        })
      ) : (
        <div>과목을 불러오고 있습니다 ...</div>
      )}
    </List>
  );
};

export default SelectionComponent;
