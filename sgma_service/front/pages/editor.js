import React, { useState, useEffect } from "react";
import Page from "../layouts/main";
import Editor from "../layouts/editor";
import Router, { useRouter } from "next/router";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";
import axios from "axios";

const Loading = props => {
  return (
    <Segment style={{ height: "80vh" }}>
      <Dimmer active inverted>
        <Loader inverted>문서 로딩 중 ...</Loader>
      </Dimmer>
    </Segment>
  );
};

const editorPage = () => {
  const router = useRouter();
  const { subject_name, path, file_name } = router.query;
  // const [loading, setLoading] = useState(true); // 로딩중
  const [data, setData] = useState(false);
  // 로그인 검증 생략 (어차피 서버에서 걸림)
  /*
        `${process.env.BACKEND_SERVICE_DOMAIN}/api/${process.env.BACKEND_SERVICE_API_VERSION}/doc/${subject_name}/${file_name}`,
          path,
        type: "file",
        soups: [],
        comment: "", // 이것은 무엇인가요
        connections: [],
        md_text: ""
  */
  useEffect(() => {
    if (!subject_name || !file_name) {
      Router.back();
    } else {
      // if else 구조가 아닌 그냥 작성하면 밑에 코드도 다 실행됨..
      axios(
        `${process.env.BACKEND_SERVICE_DOMAIN}/api/${
          process.env.BACKEND_SERVICE_API_VERSION
        }/doc/${subject_name}/${file_name}?path=${path ? path : ""}`,
        { withCredentials: true }
      )
        .then(({ data }) => {
          if (data.hasOwnProperty("isLogin") && data.isLogin === false) {
            Router.replace("/login");
          } else {
            setData(data);
          }
        })
        .catch(e => {
          alert("data 불러오기 실패 error");
          Router.back();
        });
    }
  }, []);
  return (
    <Page>
      {!data ? (
        <Loading />
      ) : (
        <Editor
          subject={subject_name}
          file={file_name}
          path={path ? path : ""}
          data={data}
        />
      )}
    </Page>
  );
};

export default editorPage;
