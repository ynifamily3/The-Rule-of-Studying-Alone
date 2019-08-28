import File from "./fileunit";

// returns 배열
const findPath = (docs, pathStr) => {
  const arr = pathStr ? pathStr.split("/") : [];
  let ref = docs; // 해당 폴더를 가리키는 참조형 변수
  // filter 로 찾아야지
  return ref;
};

const FileItems = props => {
  const { path } = props; // path: current path
  const { docs } = props.docs;
  const currPathList = findPath(docs, path);
  // console.warn(docs);
  console.warn(currPathList);
  if (typeof window !== "undefined") {
    console.log(`docs :`, docs);
    console.log(`path : ${path ? path : "<root>"}`);
  }

  // 해당 레벨 객체로 이동하여 폴더와 파일 리스트를 표출한다.
  return (
    <ul className="items">
      <File fileName="수학" type="folder" />
      <File fileName="과학" type="file" />
    </ul>
  );
};

export default FileItems;
