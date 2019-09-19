import React, { useState, useEffect, useCallback } from "react";
import Page from "../layouts/main";
import CustomModal from "../components/modal/custommodal";
import { Button, Form, Input, Dimmer, Loader } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { ADD_SUBJECT, FETCH_SUBJECT } from "../reducers/subjects";
import SelectionComponent from "../components/subjects/selection";
import axios from "axios";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { LOG_IN_SUCCESS } from "../reducers/userinfo";
import Protocol from "../libs/md-2-tree/protocol";
import Mocktest from "../libs/md-2-tree/mocktest";
import TFQuiz from "../components/quiz/mock/TFQuiz";
import SelQuiz from "../components/quiz/mock/SelQuiz"
import ShortQuiz from "../components/quiz/mock/ShortQuiz"
import Immutable from "immutable";

// 폴더 이름 또는 파일 이름 + path

const MocktestPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  //const user = useSelector(state => state.userinfo);
  //const docsDefault = useSelector(state => state.docs); // docs 루트에 하나 더 둬야겠다.
  const { subject, path, file } = router.query; // 주제명, 패쓰, 파일명
  const [isLoaded, setIsLoaded] = useState(false);
  const [userSelected, setUserSelected] = useState(Immutable.List([]));

  const handleFn = (index, value) => {
    setUserSelected(userSelected.set(index, value));
    // 비동기
  };

  useEffect(() => {
    if (!subject) {
      router.replace("/");
      return;
    }
    if (!file && !path) {
      // subject
      axios(
        `${process.env.BACKEND_SERVICE_DOMAIN}/api/${process.env.BACKEND_SERVICE_API_VERSION}/soup/${subject}`,
        { withCredentials: true }
      ).then(({ data }) => {
        console.log(data); // isLogin / error handling
        if (data.hasOwnProperty("isLogin") && data.isLogin === false) {
          alert("로그인이 필요합니다.");
          router.replace("/login");
        } else if (data.hasOwnProperty("error")) {
          alert(data.error);
        } else {
          const soup = Protocol.parse_message(data);
          const quest = Mocktest.create_mocktest(soup.roots, 5).quests.reduce(
            (a, b) => {
              if (b) a.push(b); // null 대응
              return a;
            },
            []
          );
          console.log(soup);
          console.log(quest);
          setIsLoaded(quest); // 로딩 완료
        }
      });
    } else if (file) {
      // subject + file (folder)
    } else {
      //
    }
  }, []);

  return (
    <Page>
      <style jsx global>
        {`
          @font-face {
            font-family: "NanumGothic";
            font-style: normal;
            font-weight: normal;
            src: url("/static/fonts/NanumGothic-Regular.woff") format("woff");
          }

          @font-face {
            font-family: "NanumGothic";
            font-style: normal;
            font-weight: bold;
            src: url("/static/fonts/NanumGothic-Bold.woff") format("woff");
          }

          @font-face {
            font-family: "NanumMyeongjo";
            font-style: normal;
            font-weight: normal;
            src: url("/static/fonts/NanumMyeongjo-Regular.woff") format("woff");
          }

          @font-face {
            font-family: "NanumMyeongjo";
            font-style: normal;
            font-weight: bold;
            src: url("/static/fonts/NanumMyeongjo-Bold.woff") format("woff");
          }

          * {
            font-family: "NanumGothic", serif;
          }

          .hongong_solid {
            /* Look */
            background: #262626;
            color: white;
          }

          .hongong-button {
            /* Look */
            background: #262626;
            color: white;
            border: 1px solid #262626;
            user-select: none;

            /* Layout*/
            padding: 5px;
            padding-left: 10px;
            padding-right: 10px;
            align-self: center;
            margin-right: 10px;
          }

          .hongong-button:hover {
            /* Look */
            border: 1px dashed white;
          }

          .hongong-button:active {
            background: white;
            color: #262626;
            border: 1px dashed #262626;
          }

          .hongong-button:focus {
            outline: none;
          }

          .hongong-textarea {
            /* Look */
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid #aaaaaa;
          }

          .hongong-textarea:focus {
            outline: none;
          }
          .header {
            height: 100px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          }

          .left {
            flex-grow: 1;
            display: flex;
            justify-content: flex-start;
            margin-left: 50px;
          }

          .right {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
            margin-right: 50px;
          }
          .mocktest {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          #subtitle {
            margin-top: 10px;
            margin-bottom: 10px;
          }
          #title {
            margin-bottom: 10px;
          }
          .mocktest-main {
            width: 90%;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            align-content: stretch;
          }
          .mocktest-sub {
            border-bottom: 1px solid black;
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: center;
          }
          .mocktest-quest {
            display: flex;
            flex-direction: row;
            align-self: flex-start;
            padding: 1em;
          }
          .mocktest-quest-sub {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 0.5em;
          }
          .mocktest-stmt {
            font-family: "NanumMyeongjo", serif;
            font-size: 0.9em;
            border: 1px solid black;
            padding: 0.5em;
          }
        `}
      </style>
      {isLoaded ? (
        <div className="mocktest">
          <div id="subtitle">
            <span style={{ fontSize: "1em" }}>제1회 {subject} 모의고사</span>
          </div>
          <div id="title">
            <span style={{ fontSize: "3em" }}>
              {file ? file : path ? path : "전체"} 영역
            </span>
          </div>
          <div>
          {userSelected.toJS().join(", ")}
          </div>
          {/* 제목 밑에 밑줄 */}
          <div style={{ borderBottom: "1px solid black", width: "90%" }} />
          {/* 메인 */}
          <div className="mocktest-main">
            {/* 왼쪽 서브 */}
            <span
              className="mocktest-sub"
              style={{ width: "50%", borderRight: "1px solid black" }}
            >
              {/* 개별 문제 */}
              {/* 참/거짓 문제 */}
              <TFQuiz
                index={0}
                handleFn={handleFn}
                statement="최초의 컴파일러은(는) 원래는 k개의 심볼을 볼 수 있는 LR(k) Parser부터
          연구를 시작했으나, k &gt; 1에 대하여 LR(1) Parser로 변환할 수 있음이
          증명되었다. 일반적으로 LR Parser는 LR(1) Parser를 의미한다."
              />
              {/* 4지선다 문제 */}
              <SelQuiz
                index={1}
                handleFn={handleFn}
                statement="다음 중 Earley Parser에 대한 설명으로 옳지 않은 것을 고르시오."
                choices={[
                  " LR(k) 문법은 시간 복잡도 O(N)만에 파싱할 수 있다.",
                  "모든 자유문맥언어(Context Free Language)를 시간 복잡도 O(N^3)만에 파싱할 수 있다.",
                  "테이블을 사용하는 방법과 재귀 상향식 구현법(Recursive Ascent)이 있다.",
                  "1970000000년대에 제이 얼리(Jay Earley)가 고안했다."
                ]}
              />
            </span>
            {/* 오른쪽 서브 */}
            <span className="mocktest-sub" style={{ width: "50%" }}>
              {/* 단답형 문제 */}
              <ShortQuiz 
              index={2}
              handleFn={handleFn}
              statement={`* 문법을 입력받아 파싱 알고리즘이 사용할 파서를 만들어내는 프로그램이다.
                * 보통 입력으로 Extended Backus-Naur Form(EBNF) 문법을 받으며, 다양한 프로그래밍 언어로 파서를 출력할 수 있다.
                * 대표적인 CFGd Parser Generator로 ANTLR가 있다.
                * 예컨데 테이블을 사용하는 LR 파서의 경우, 파싱 테이블이 필요하다. 이를 기계적으로 생성하는 프로그램을 의미한다.`}
              />
            </span>
          </div>
        </div>
      ) : (
        <div style={{ height: "100vh" }}>
          <Dimmer active inverted>
            <Loader inverted>
              <span style={{ fontWeight: "bold" }}>문제 생성 중 ...</span>
            </Loader>
          </Dimmer>
        </div>
      )}
    </Page>
  );
};

export default MocktestPage;
