import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { List } from "semantic-ui-react";
// import axios from "axios";

const SelectionComponent = props => {
  const { isLogin } = props;
  const subjectList = !isLogin
    ? []
    : useSelector(state => state.subjects).toJS().subjects; // reducer -> index.js -> rootReducer -> userinfo

  return (
    <List>
      {subjectList.map((x, i) => {
        return (
          <List.Item key={"subject_name-".concat(i)}>
            <Link
              href={{
                pathname: "dashboard",
                query: { subject: x["subject_name"] }
              }}
            >
              <a>{x["subject_name"]}</a>
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
};

export default SelectionComponent;
