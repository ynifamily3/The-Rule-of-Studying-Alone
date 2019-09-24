import Immutable from "immutable";

export const initialState = Immutable.fromJS({
  docs: [],
  subject: "" // docs의 subject
});

export const CLEAR_DOCS = "CLEAR_DOCS";

export const FETCH_DOCS = "FETCH_DOCS";
export const FETCH_DOCS_SUCCESS = "FETCH_DOCS_SUCCESS";
export const FETCH_DOCS_FAILURE = "FETCH_DOCS_FAILURE";

export const ADD_FOLDER = "ADD_FOLDER";
export const ADD_FOLDER_SUCCESS = "ADD_FOLDER_SUCCESS";
export const ADD_FOLDER_FAILURE = "ADD_FOLDER_FAILURE";

export const ADD_FILE = "ADD_FILE";
export const ADD_FILE_SUCCESS = "ADD_FILE_SUCCESS";
export const ADD_FILE_FAILURE = "ADD_FILE_FAILURE";

export const MOVE_FILE = "MOVE_FILE";
export const RENAME_FOLDER = "RENAME_FOLDER";
export const RENAME_FILE = "RENAME_FILE";

export const DELETE_ELEMENT = "DELETE_ELEMENT"; // 파일 폴더 공용
export const DELETE_ELEMENT_SUCCESS = "DELETE_ELEMENT_SUCCESS";
export const DELETE_ELEMENT_FAILURE = "DELETE_ELEMENT_FAILURE";

const reducer = (state = initialState.toJS(), action) => {
  const { type, data } = action;
  switch (type) {
    case CLEAR_DOCS:
      return initialState;
    case FETCH_DOCS:
      return Immutable.fromJS(state);
    case FETCH_DOCS_FAILURE: // 실패인 경우 에러 코드를 집어넣는게 좋을 것 같기도... 아예 비어 있으니 뭔가 이상함.
      return Immutable.fromJS({ error: "failed to fetch docs" });
    case FETCH_DOCS_SUCCESS:
      return data; //data 문제 없겠지?
    // return Immutable.fromJS(data.toJS()); // copy에 해당하는 게 있나 살펴 봐야겠다. (performance 문제, subject도 마찬가지!)

    case DELETE_ELEMENT:
      return state;

    case DELETE_ELEMENT_SUCCESS:
      console.log("삭제성공");
      const deleteState = state.toJS();
      if (data.path === "" || data.path === "/") {
        //console.warn(data)
        /*
          elem_name: "b"
          path: ""
          subject_name: "데이터베이스"
        */
        console.warn(deleteState);
        // deleteState.docs 의 배열에서, name이 data.subjet_name 이랑 같은 것을 찾아서 삭제해야한다.
        for (let i = 0; i < deleteState.docs.length; i++) {
          if (deleteState.docs[i].name === data["elem_name"]) {
            deleteState.docs.splice(i, 1); // 해당인덱스삭제
            break;
          }
        }
      } else {
        // drill find2
        const d = data.path.split("/").splice(1); // ['path','data','paths']
        let pointer = deleteState; // { docs : [] }
        for (let i = 0; i < d.length; i++) {
          pointer =
            pointer.docs[
              pointer.docs.findIndex(elem => {
                return d[i] === elem.name;
              })
            ];
        }
        console.log(pointer);
        for (let i = 0; i < pointer.docs.length; i++) {
          if (pointer.docs[i].name === data["elem_name"]) {
            pointer.docs.splice(i, 1); // 해당인덱스삭제
            break;
          }
        }
        /*
        pointer.docs.push({
          type: "file",
          name: data["file_name"]
        });*/
      }
      return Immutable.fromJS(deleteState);
    case DELETE_ELEMENT_FAILURE:
      console.log("삭제실패");
      return state;

    case ADD_FILE:
      return state; // Immutable.fromJS(state) 안해도 됨... 이미 state는 그거구나.. (근데 했던 이유가 있는거같은데 일단존버)
    case ADD_FILE_SUCCESS:
      console.log("파일추가 성공");
      const addFileState = state.toJS(); // {docs:[]}
      if (data.path === "" || data.path === "/") {
        addFileState.docs.push({
          type: "file",
          name: data["file_name"]
        });
      } else {
        // drill find
        const d = data.path.split("/").splice(1); // ['path','data','paths']
        let pointer = addFileState; // { docs : [] }

        for (let i = 0; i < d.length; i++) {
          pointer =
            pointer.docs[
              pointer.docs.findIndex(elem => {
                return elem.type === "folder" && d[i] === elem.name;
              })
            ];
        }
        console.log(pointer);
        pointer.docs.push({
          type: "file",
          name: data["file_name"]
        });
      }
      return Immutable.fromJS(addFileState); // state는 이미 Immutable 객체임.
    case ADD_FILE_FAILURE:
      console.log("파일추가 실패");
      return state; // Immutable.fromJS(state)
    case ADD_FOLDER:
      return Immutable.fromJS(state);
    case ADD_FOLDER_FAILURE:
      console.log("폴더추가 실패");
      return Immutable.fromJS(state);
    case ADD_FOLDER_SUCCESS:
      console.log("폴더추가 성공");
      const rawState = state.toJS(); // {docs:[]}
      if (data.path === "" || data.path === "/") {
        rawState.docs.push({
          type: "folder",
          name: data["folder_name"],
          docs: []
        });
      } else {
        // drill find
        const d = data.path.split("/").splice(1); // ['path','data','paths']
        let pointer = rawState; // { docs : [] }
        //console.log(pointer);

        for (let i = 0; i < d.length; i++) {
          pointer =
            pointer.docs[
              pointer.docs.findIndex(elem => {
                return elem.type === "folder" && d[i] === elem.name;
              })
            ];
        }
        console.log(pointer);
        pointer.docs.push({
          type: "folder",
          name: data["folder_name"],
          docs: []
        });
      }
      return Immutable.fromJS(rawState); // state는 이미 Immutable 객체임.
    default:
      return Immutable.fromJS(state);
  }
};

export default reducer;

/*
    /*
    [
    {
      type: "folder",
      name: "과학",
      docs: [
        { type: "folder", name: "기타과학", docs: [] },
        {
          type: "folder",
          name: "지구과학",
          docs: [
            { type: "file", name: "지구과학의 역사" },
            { type: "file", name: "내가 지구를 만들었다" }
          ]
        }
      ]
    },
    { type: "folder", name: "리시프", docs: [] },
    { type: "file", name: "수학" }
  ]
*/
