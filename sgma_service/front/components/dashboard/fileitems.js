import File from "./fileunit";

// docs : 전체 state
// pathstr : 과학/지구과학 또는 ""
const findPath = (docs, pathStr) => {
  // 디펜던시 찾기 귀찮아서 처음에 "/"가 들어가는 원인을 파악 못함...
  const arr = pathStr ? pathStr.split("/") : []; // 쪼개진 경로
  let ref = docs; // 해당 폴더를 가리키는 참조형 변수
  for (let i = 0; i < arr.length; i++) {
    ref = ref.filter(elem => {
      return elem.type === "folder" && elem.name === arr[i];
    })[0].docs;
    if (!ref) break; // 유효하지 않은 경로로 접근할 때 (필요없는 코드인데 삭제 요망)
  }
  return ref ? ref : []; // undefined 방지용
};

const FileItems = props => {
  const { path, subject } = props; // path: current path
  const { docs } = props.docs;
  // docs 에 length 가 있어야 진행시키도록 하자..
  if (docs && docs.length) {
    const currPathList = findPath(docs, path);
    return (
      <ul className="items">
        {currPathList.map((x, i) => {
          return (
            <File
              subject={subject}
              fileName={x.name}
              type={x.type}
              key={"fileElem" + i}
              path={path ? path.concat("/").concat(x.name) : x.name} // 처음에 /생기는거 방지
            />
          );
        })}
      </ul>
    );
  } else {
    return <div>잠시만요...</div>;
  }
};

export default FileItems;
