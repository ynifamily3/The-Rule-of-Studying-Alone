import Immutable from "immutable";

export const initialState = Immutable.fromJS({
  subjects: []
});

/*

{
    subjects: [
        {
            subject_name: *String,
            docs: [
                ...
            ]
        },
        {
            ...
        }
    ]
}

*/

export const ADD_SUBJECT = "ADD_SUBJECT";
export const ADD_SUBJECT_SUCCESS = "ADD_SUBJECT_SUCCESS";
export const ADD_SUBJECT_FAILURE = "ADD_SUBJECT_FAILURE";

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

const reducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case ADD_SUBJECT: // redux saga로 파라미터를 넘기는 법은?
      return { ...state };

    case ADD_SUBJECT_FAILURE:
      return { ...state };

    case ADD_SUBJECT_SUCCESS:
      // subject_name의 중복 체크 안함. 해야됨. (혹은 서버 단에서 거부하면 failure action으로 내려온다.)
      return state.updateIn(["subjects"], docs =>
        docs.push(
          Immutable.fromJS({
            subject_name: data["subject_name"],
            docs: []
          })
        )
      );
    default:
      return { ...state };
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
