const Increment = "Increment";

// Action 생성 함수
export const increment = () => ({
  type: Increment
});

// default state definition
const initialState = {
  number: 765
};

// make reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Increment:
      return {
        number: state.number + 1
      }; // 변경된 부분만 리턴
    default:
      return state; // 해당 state를 그대로 리턴
  }
};

export default reducer;
