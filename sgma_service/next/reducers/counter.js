const Increment = "Increment";

// default state definition
const initialState = {
  number: 765
};

// make reducer
const counter = (state = initialState, action) => {
  switch (action.type) {
    case Increment:
      return {
        ...state,
        number: state.number + 1
      };
    default:
      return state; // 해당 state를 그대로 리턴
  }
};

export default counter;
