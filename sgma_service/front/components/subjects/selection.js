import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { List } from "semantic-ui-react";
import axios from "axios";

const SelectionComponent = props => {
  let { isLogin } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    if (isLogin) {
      // {"isLogin":false}
      axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/docs`, {
        withCredentials: true
      }).then(({ data }) => {
        if (data.isLogin === false) {
          isLogin = false; // server 검증 결과..
        } else {
          setListItems(
            data.subjects.map(x => {
              return x["subject_name"];
            })
          );
        }
      });
    } else {
      setIsLoaded(true);
    }
  }, [isLogin]);

  return !isLoaded ? (
    <div>Loading...</div>
  ) : (
    <List>
      {!isLogin ? (
        <div>로그인을 안 했습니다.</div>
      ) : (
        listItems.map((x, i) => {
          return (
            <List.Item key={"SubjectSelectionItem-".concat(i)}>{x}</List.Item>
          );
        })
      )}
    </List>
  );
};

export default SelectionComponent;
