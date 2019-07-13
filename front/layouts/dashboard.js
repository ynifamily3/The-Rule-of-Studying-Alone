import GnbHeader from "../components/dashboard/gnbheader";
import Aside from "../components/dashboard/aside";
import Contents from "../components/dashboard/contents";
export default ({ children }) => (
  <div
    className="contentWrapper"
    style={{
      width: "100%",
      height: "100vh",
      margin: "0 auto",
      textAlign: "left",
      overflow: "hidden"
    }}
  >
    <GnbHeader />
    <div
      id="main"
      style={{
        display: "flex"
      }}
    >
      <Aside />
      <Contents />
    </div>
  </div>
);