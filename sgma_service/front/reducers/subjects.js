import Immutable from "immutable";

export const initialState = Immutable.fromJS({
  subjects: []
});

export const FETCH_SUBJECT = "FETCH_SUBJECT";
export const FETCH_SUBJECT_SUCCESS = "FETCH_SUBJECT_SUCCESS";
export const FETCH_SUBJECT_FAILURE = "FETCH_SUBJECT_FAILURE";
export const ADD_SUBJECT = "ADD_SUBJECT";
export const ADD_SUBJECT_SUCCESS = "ADD_SUBJECT_SUCCESS";
export const ADD_SUBJECT_FAILURE = "ADD_SUBJECT_FAILURE";
// 다음과 같은 액션 추가 : API로 일괄적으로 모든 data를 로드해 오는것

export const fetchSubjectAction = {
  type: FETCH_SUBJECT
};

export const fetchSubjectSuccessAction = {
  type: FETCH_SUBJECT_SUCCESS
};

export const fetchSubjectFailureAction = {
  type: FETCH_SUBJECT_FAILURE
};

export const addSubjectAction = {
  type: ADD_SUBJECT
};

export const addSubjectSuccessAction = {
  type: ADD_SUBJECT_SUCCESS
};

export const addSubjectFailureAction = {
  type: ADD_SUBJECT_FAILURE
};

// apply redux - saga
// ADD_SUBJECT -> saga -> API call -> 1) ADD_SUBJECT_SUCCESS || 2) ADD_SUBJECT_FAILURE

const reducer = (state = initialState.toJS(), action) => {
  const { type, data } = action;
  switch (type) {
    case ADD_SUBJECT:
      return Immutable.fromJS(state); // toJS() => fromJS 이렇게 해도 performance 문제는 없나? 좀더 나은 해결책은 고민해 봐야 겠음.

    case ADD_SUBJECT_FAILURE:
      console.log("서브젝트 추가 실패...!!");
      return Immutable.fromJS(state);

    case ADD_SUBJECT_SUCCESS:
      // subject_name의 중복 체크 안함. 해야됨. (혹은 서버 단에서 거부하면 failure action으로 내려온다.)
      const rawData = data.toJS();
      return state.updateIn(["subjects"], docs =>
        docs.push(
          Immutable.fromJS({
            subject_name: rawData["subject_name"],
            docs: []
          })
        )
      );
    case FETCH_SUBJECT:
      return Immutable.fromJS(state);
    case FETCH_SUBJECT_FAILURE:
      console.log("Failed to fetch subjects");
      return Immutable.fromJS(state);
    case FETCH_SUBJECT_SUCCESS:
      return Immutable.fromJS(data.toJS()); // 그냥 from이랑 to랑 상쇄되는거 아님? 나중에 수정예상
    default:
      return Immutable.fromJS(state);
  }
};

export default reducer;

/*
const myMap = Immutable.fromJS({
  nested: {
    someKey: ['hello', 'world'],
  },
});
 const myNewMap = myMap.updateIn(['nested', 'someKey'], arr => arr.push('bye'));
 console.log(myNewMap.toJS());
 */

/*
With .setIn() you can do the same:

let obj = fromJS({
  elem: [
    {id: 1, name: "first", count: 2},
    {id: 2, name: "second", count: 1},
    {id: 3, name: "third", count: 2},
    {id: 4, name: "fourth", count: 1}
  ]
});

obj = obj.setIn(['elem', 3, 'count'], 4);

If we don’t know the index of the entry we want to update. It’s pretty easy to find it using .findIndex():

const indexOfListToUpdate = obj.get('elem').findIndex(listItem => {
  return listItem.get('name') === 'third';
});
obj = obj.setIn(['elem', indexOfListingToUpdate, 'count'], 4);
*/
