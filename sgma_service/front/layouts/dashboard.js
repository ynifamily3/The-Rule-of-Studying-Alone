import GnbHeader from "../components/dashboard/gnbheader";
import Aside from "../components/dashboard/aside";
import Contents from "../components/dashboard/contents";
import { useSelector, useDispatch } from "react-redux";
import { FETCH_SUBJECT } from "../reducers/subjects";
import React, { useState, useEffect } from "react";

export default props => {
  const dispatch = useDispatch();
  // const [subjects, setSubjects] = useState([props.subject]);
  const subjects = useSelector(state => state.subjects);
  useEffect(() => {
    dispatch({
      type: FETCH_SUBJECT
    });
  }, []);
  return (
    <div
      className="contentWrapper"
      style={{
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        textAlign: "left",
        overflow: "hidden",
        flexDirection: "column"
      }}
    >
      <GnbHeader user={props.user} subjects={subjects} />
      <div
        id="main"
        style={{
          display: "flex"
        }}
      >
        <Contents
          docsDefault={props.docsDefault}
          subject={props.subject}
          user={props.user}
          path={props.path}
        />
      </div>
    </div>
  );
};
