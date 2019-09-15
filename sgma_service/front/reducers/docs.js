import Immutable from "immutable";

export const initialState = Immutable.fromJS({
  docs: []
});

export const FETCH_DOCS = "FETCH_DOCS";
export const FETCH_DOCS_SUCCESS = "FETCH_DOCS_SUCCESS";
export const FETCH_DOCS_FAILURE = "FETCH_DOCS_FAILURE";

export const ADD_FOLDER = "ADD_FOLDER";
export const ADD_FOLDER_SUCCESS = "ADD_FOLDER_SUCCESS";
export const ADD_FOLDER_FAILURE = "ADD_FOLDER_FAILURE";

export const ADD_FILE = "ADD_FILE";
export const MOVE_FILE = "MOVE_FILE";
export const RENAME_FOLDER = "RENAME_FOLDER";
export const RENAME_FILE = "RENAME_FILE";
export const DELETE_FOLDER = "DELETE_FOLDER";
export const DELETE_FILE = "DELETE_FILE";
/*
export const fetchDocs = {
  type: FETCH_DOCS
};

export const fetchDocsSuccessAction = {
  type: FETCH_DOCS_SUCCESS
};

export const fetchDocsFailureAction = {
  type: FETCH_DOCS_FAILURE
};

export const addFolder = {
  type: ADD_FOLDER,
  data: { folder_name: "folder_name_default", file_name: [] }
};

export const addFile = {
  type: ADD_FILE,
  data: { folder_name: "folder_name_default", file_name: "file_name_default" }
};
*/

const reducer = (state = initialState.toJS(), action) => {
  const { type, data } = action;
  switch (type) {
    case FETCH_DOCS:
      return Immutable.fromJS(state);
    case FETCH_DOCS_FAILURE: // 실패인 경우 에러 코드를 집어넣는게 좋을 것 같기도... 아예 비어 있으니 뭔가 이상함.
      return Immutable.fromJS({ error: "failed to fetch docs" });
    case FETCH_DOCS_SUCCESS:
      return data; // 문제 없겠지?
    // return Immutable.fromJS(data.toJS()); // copy에 해당하는 게 있나 살펴 봐야겠다. (performance 문제, subject도 마찬가지!)

    /* 밑 부분 싸그리 Immutable 과  호환되도록 수정해야 함 */
    /*
    case ADD_FOLDER:
      return {
        ...state,
        docs: [...state.docs, data]
      };
    case ADD_FILE:
      return {
        ...state,
        docs: [
          ...state.docs.filter(x => x.folder_name !== data.folder_name),
          {
            folder_name: data_folder_name,
            file_name: [
              ...state.docs.filter(x => x.folder_name === data.folder_name)[0]
                .file_name,
              data.file_name
            ]
          }
        ]
      }; // 가독성을 좋게 하기 위해서는 이뮤터블 js를 써야 할 필요가 있다!! => 곧 수정하러갈게 기다려
      */
    case ADD_FOLDER:
      return Immutable.fromJS(state);
    case ADD_FOLDER_FAILURE:
      console.log("폴더 추가 실패...!!");
      return Immutable.fromJS(state);
    case ADD_FOLDER_SUCCESS:
      console.warn("폴더추가 성공");
      // state 를 찍어보면 Immutable 형태던데?
      // console.warn(state);
      // console.warn(data);
      /*
        {
          folder_name: "세부역사14"
          path: "/역사"
          subject_name: "리눅스시스템프로그래밍"
        }
      */
      // console.log(state.toJS()); // {docs: [Array]}
      const rawState = state.toJS(); // {docs:[]}
      // find like drill with data.path === "" or data.path === "/~"
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
      //console.log(data);
      //console.warn(rawState);
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
