import Immutable from "immutable";

export const initialState = Immutable.fromJS({
  docs: []
});

/* 우선 구현 영역 */
export const FETCH_DOCS = "FETCH_DOCS";

/* 조금 있다 구현해야 할 영역 */
export const ADD_FOLDER = "ADD_FOLDER";
export const ADD_FILE = "ADD_FILE";
export const MOVE_FILE = "MOVE_FILE";
export const RENAME_FOLDER = "RENAME_FOLDER";
export const RENAME_FILE = "RENAME_FILE";
export const DELETE_FOLDER = "DELETE_FOLDER";
export const DELETE_FILE = "DELETE_FILE";

export const fetchDocs = {
  type: FETCH_DOCS,
  data: {
    subject: "subject_default"
  }
};

export const addFolder = {
  type: ADD_FOLDER,
  data: { folder_name: "folder_name_default", file_name: [] }
};

export const addFile = {
  type: ADD_FILE,
  data: { folder_name: "folder_name_default", file_name: "file_name_default" }
};

const reducer = (state = initialState.toJS(), action) => {
  const { type, data } = action;
  switch (type) {
    case FETCH_DOCS:
      return Immutable.fromJS(state);

    /* 밑 부분 싸그리 Immutable 과  호환되도록 수정해야 함 */
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
    default:
      return { ...state };
  }
};

export default reducer;

/*
    /*
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
*/
