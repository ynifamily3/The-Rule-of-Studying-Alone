import "../../css/main/common.css";
import { Router, useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { LOG_OUT } from "../../reducers/userinfo";
import Link from "next/link";

export default props => {
  const dispatch = useDispatch();
  const router = useRouter();
  const subjects = props.subjects ? props.subjects.toJS().subjects : [];
  const user = props.user
    ? props.user
    : {
        isLogin: true,
        user: {
          nickname: "jk(테스트)"
        }
      };
  // console.warn(subjects.toJS().subjects)
  const loginClick = e => {
    router.push("/login");
  }
  const logoutClick = e => {
    dispatch({
      type: LOG_OUT
    });
    router.push("/");
  };
  return (
    <div>
      <style jsx global>
        {`
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

          /* MAIN IMAGE */
          .main-img {
            overflow: hidden;
            height: 300px;
          }

          .on-img-text {
            position: absolute;
            font-size: 4vw;
            color: #ffffff;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          /* INTRO TEXT */
          .intro {
            display: flex;
            justify-content: center;
            height: 200px;
          }

          .intro img {
            align-self: center;
            padding-left: 50px;
            padding-right: 50px;
          }

          .intro-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 33%;
            max-width: 300px;
          }

          /* COUNTERS */
          .counters {
            width: 100%;
            height: 100px;
            display: flex;
            flex-direction: ltr;
            justify-content: space-evenly;
          }

          .counter-elem {
            border: 1px double white;
            padding: 20px;
            align-self: center;
          }
        `}
      </style>
      <div className="header hongong_solid">
        <span className="left">
          <a href="/">
            <img
              src="/static/img/logo-small.png"
              style={{ width: 177, height: 100 }}
            />
          </a>
          {subjects &&
            subjects.map((x, i) => {
              return (
                <a style={{lineHeight: '7em'}} key={'subs'+i} href={`/dashboard?subject=${x['subject_name']}`}>
                <button className="hongong-button">
                    {x["subject_name"]}
                </button>
                </a>
              );
            })}
        </span>
        <span className="right">
          {!user.isLogin && (
            <button className="hongong-button" id="join">
              회원가입
            </button>
          )}
          {!user.isLogin ? (
            <button
              onClick={loginClick}
              className="hongong-button"
              id="sign-in"
            >
              로그인
            </button>
          ) : (
            <button
              onClick={logoutClick}
              className="hongong-button"
              id="sign-in"
            >
              로그아웃 ( {user.user.nickname} )
            </button>
          )}
        </span>
      </div>
    </div>
  );
};
