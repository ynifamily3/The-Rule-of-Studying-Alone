import File from "./fileunit";
const FileItems = props => {
  const { docs, path } = props; // path: current path
  if (typeof window !== "undefined") {
    console.log(docs);
    console.log(path);
  }
  return (
    <ul className="items">
      <File fileName="수학" type="folder" />
      <File fileName="과학" type="file" />
    </ul>
  );
};

export default FileItems;
