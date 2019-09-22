import React, { useState, useEffect, useCallback } from "react";
import Page from "../layouts/main";
import CustomModal from "../components/modal/custommodal";
import { Button, Icon, Dimmer, Loader } from "semantic-ui-react";
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
import SelQuiz from "../components/quiz/mock/SelQuiz";
import ShortQuiz from "../components/quiz/mock/ShortQuiz";
import Immutable from "immutable";

// 폴더 이름 또는 파일 이름 + path

const MocktestPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subject, path, file, numOfProblem } = router.query; // 주제명, 패쓰, 파일명
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setuserName] = useState(null);
  const [userSelected, setUserSelected] = useState(Immutable.List([]));
  const [answers, setAnswers] = useState([]);
  const [solveState, setSolveState] = useState([]);

  const handleFn = (index, value) => {
    setUserSelected(userSelected.set(index, value));
  };

  const markProblem = useCallback(
    e => {
      const userSelectedJS = userSelected.toJS();
      const result = answers.map((x, i) => {
        console.log(x);
        if (x === userSelectedJS[i]) return 1;
        // correct
        else return 2; // incorrect
      });
      setSolveState(result);
    },
    [answers, userSelected, setSolveState]
  );

  const resetProblem = useCallback(
    e => {
      window.location.reload(); // it hacks!! (redux state를 잃어버림)
    },
    [setSolveState, setUserSelected, router]
  );

  useEffect(() => {
    if (!subject) {
      router.replace("/");
      return;
    }

    // state rebuilding - user
    axios(`${process.env.BACKEND_SERVICE_DOMAIN}/api/userinfo`, {
      withCredentials: true
    }).then(({ data }) => {
      if (data.isLogin) {
        setuserName(data.user.nickname);
        dispatch({
          type: LOG_IN_SUCCESS,
          data
        });
      }
    });

    // subject
    const url =
      !file && !path
        ? `${process.env.BACKEND_SERVICE_DOMAIN}/api/${process.env.BACKEND_SERVICE_API_VERSION}/soup/${subject}`
        : `${process.env.BACKEND_SERVICE_DOMAIN}/api/${
            process.env.BACKEND_SERVICE_API_VERSION
          }/soup/${subject}/${file}?path=${path ? path : ""}`;
    axios(url, { withCredentials: true }).then(({ data }) => {
      // console.log(data); // isLogin / error handling
      if (data.hasOwnProperty("isLogin") && data.isLogin === false) {
        alert("로그인이 필요합니다.");
        router.replace("/login");
      } else if (data.hasOwnProperty("error")) {
        alert(data.error);
      } else {
        const soup = Protocol.parse_message(data);
        const nP = numOfProblem
          ? numOfProblem * 1 <= 20 && numOfProblem * 1 > 0
            ? numOfProblem * 1
            : 20
          : 20;
        const quest = Mocktest.create_mocktest(soup.roots, nP).quests.reduce(
          (a, b) => {
            b && a.push(b); // null 대응
            return a;
          },
          []
        );
        // console.log(soup);
        console.log(quest);
        setIsLoaded(quest); // 로딩 완료
        let answers = quest.map(x => {
          const { answers } = x;
          return answers[0];
        });
        setAnswers(answers);
      }
    });
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
            position: fixed;
            top: 0;
            z-index: 999;
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
            display: flex;
            flex-direction: row;
            align-items: stretch;
            align-content: stretch;
            margin-bottom: 100px;
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
      <div className="header hongong_solid">
        <span className="left">
          <Link href="/">
            <a>
              <img
                src="/static/img/logo-small.png"
                style={{ width: 177, height: 100 }}
              />
            </a>
          </Link>
        </span>
        <span className="right">
          <button className="hongong-button" id="sign-out">
            {userName ? `로그아웃 ( ${userName} )` : ""}
          </button>
        </span>
      </div>
      {isLoaded ? (
        <div
          className="mocktest"
          style={{
            backgroundColor: "white",
            marginTop: "100px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "stretch",
              backgroundColor: "white",
              boxShadow: "5px 3px 10px 0px rgba(128,128,128,1)",
              margin: "32px 0",
              width: "70%",
              maxWidth: "896px"
            }}
          >
            <div id="subtitle">
              <span style={{ fontSize: "1em" }}>제1회 {subject} 모의고사</span>
            </div>
            <div id="title" style={{ marginBottom: "2em" }}>
              <span style={{ fontSize: "3em" }}>
                {file ? file : path ? path : "전체"} 영역
              </span>
            </div>
            {/* 제목 밑에 밑줄 */}
            <div
              style={{
                width: "96%",
                borderBottom: "1px solid black"
              }}
            />
            {/* 메인 */}
            <div
              className="mocktest-main"
              style={{
                width: "96%",
                backgroundColor: "white"
              }}
            >
              {/* 왼쪽 서브 */}
              <span
                className="mocktest-sub"
                style={{ width: "50%", borderRight: "1px solid black" }}
              >
                {isLoaded
                  .slice(
                    0,
                    Math.floor(isLoaded.length / 2 + (isLoaded.length % 2))
                  )
                  .map((quest, idx) => {
                    switch (quest.type) {
                      case "binary":
                        return (
                          <TFQuiz
                            key={idx}
                            title={quest.title}
                            index={idx}
                            handleFn={handleFn}
                            statement={quest.statement}
                            solveState={solveState[idx]}
                            answer={answers[idx]}
                          />
                        );
                      case "selection":
                      case "selection2":
                        return (
                          <SelQuiz
                            key={idx}
                            title={quest.title}
                            index={idx}
                            handleFn={handleFn}
                            statement={quest.statement}
                            choices={quest.choices}
                            solveState={solveState[idx]}
                            answer={answers[idx]}
                          />
                        );
                      case "short":
                        return (
                          <ShortQuiz
                            key={idx}
                            title={quest.title}
                            index={idx}
                            handleFn={handleFn}
                            statement={quest.statement}
                            solveState={solveState[idx]}
                            answer={answers[idx]}
                          />
                        );
                      default:
                        return <div key={idx}>....</div>;
                    }
                  })}
              </span>
              {/* 오른쪽 서브 */}
              <span className="mocktest-sub" style={{ width: "50%" }}>
                {isLoaded
                  .slice(
                    Math.floor(isLoaded.length / 2 + (isLoaded.length % 2)),
                    isLoaded.length
                  )
                  .map((quest, idx) => {
                    const newIdx =
                      idx +
                      Math.floor(isLoaded.length / 2 + (isLoaded.length % 2));
                    switch (quest.type) {
                      case "binary":
                        return (
                          <TFQuiz
                            key={newIdx}
                            title={quest.title}
                            index={newIdx}
                            handleFn={handleFn}
                            statement={quest.statement}
                            solveState={solveState[newIdx]}
                            answer={answers[newIdx]}
                          />
                        );
                      case "selection":
                      case "selection2":
                        return (
                          <SelQuiz
                            key={newIdx}
                            title={quest.title}
                            index={newIdx}
                            handleFn={handleFn}
                            statement={quest.statement}
                            choices={quest.choices}
                            solveState={solveState[newIdx]}
                            answer={answers[newIdx]}
                          />
                        );
                      case "short":
                        return (
                          <ShortQuiz
                            key={newIdx}
                            title={quest.title}
                            index={newIdx}
                            handleFn={handleFn}
                            statement={quest.statement}
                            solveState={solveState[newIdx]}
                            answer={answers[newIdx]}
                          />
                        );
                      default:
                        return <div key={newIdx}>....</div>;
                    }
                  })}
              </span>
            </div>{" "}
          </div>
          {/* (채점)리모콘 */}
          <div
            className="remote"
            style={{
              position: "fixed",
              top: "87%",
              right: "10em",
              textAlign: "center",
              width: "150px"
            }}
          >
            <Button.Group vertical>
              <Button fluid color="blue" onClick={markProblem}>
                <Icon name="check" />
                채점하기
              </Button>
              <Button fluid color="grey" onClick={resetProblem}>
                <Icon name="undo" />
                다시풀기
              </Button>
            </Button.Group>
          </div>
        </div>
      ) : (
        <div style={{ height: "auto" }}>
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
