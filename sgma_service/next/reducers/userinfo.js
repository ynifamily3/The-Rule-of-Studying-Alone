export const initialState = {
  isLogin: false,
  auth_method: null,
  user_id: null,
  nickname: null,
  email: null,
  profile_photo: null,
  createdAt: null
};

export const LOG_IN = "LOG_IN"; // 로그인하는 액션의 이름
export const LOG_OUT = "LOG_OUT";

export const loginAction = {
  type: LOG_IN
};

export const logoutAction = {
  type: LOG_OUT
};

// state와 action을 받아서 다음 state를 만들어 낸다.
const reducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case LOG_IN:
      return { isLogin: true, ...data };
    case LOG_OUT:
      return { ...initialState };
    default:
      return { ...state };
  }
};

export default reducer;
