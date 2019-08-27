/*
{
  docs : [
    {type:'folder', name:'과학', docs:[
      {type: 'folder', name: '기타과학', docs[...]},
      {type: 'file', name:'지구과학'}
    ]},
    {type:'folder', name: '리시프', docs:[...]},
    {type:'file', name:'수학'}
  ]
}

*/
export const initialState = {
  docs: [
    { folder_name: "수학", file_name: ["수열", "기하", "집합", "함수"] },
    { folder_name: "과학", file_name: ["생물", "지구과학"] },
    { folder_name: "영어", file_name: ["문법", "듣기", "읽기"] }
  ] // sample - data
};

export const ADD_FOLDER = "ADD_FOLDER";
export const ADD_FILE = "ADD_FILE";
export const MOVE_FILE = "MOVE_FILE";
export const RENAME_FOLDER = "RENAME_FOLDER";
export const RENAME_FILE = "RENAME_FILE";
export const DELETE_FOLDER = "DELETE_FOLDER";
export const DELETE_FILE = "DELETE_FILE";

export const addFolder = {
  type: ADD_FOLDER,
  data: { folder_name: "folder_name_default", file_name: [] }
};

export const addFile = {
  type: ADD_FILE,
  data: { folder_name: "folder_name_default", file_name: "file_name_default" }
};

const reducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
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
      }; // 가독성을 좋게 하기 위해서는 이뮤터블 js를 써야 할 필요가 있다!!
    default:
      return { ...state };
  }
};

export default reducer;
// action도 자주 쓰이니 export 해주세요!
