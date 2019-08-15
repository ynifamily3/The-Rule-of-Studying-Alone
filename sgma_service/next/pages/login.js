import { useSelector } from "react-redux";
import Page from "../layouts/main";
import Login from "../components/login";

export default () => {
  const user = useSelector(state => state.userinfo); // filename?
  return (
    <Page>
      <Login user={user} />
    </Page>
  );
};
