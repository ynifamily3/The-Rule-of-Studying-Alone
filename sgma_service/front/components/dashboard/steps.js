import { Breadcrumb, Icon } from "semantic-ui-react";
import { encodeSGMAStr } from "../../libs/path-encryptor";
import { md5 } from "../../libs/md5";
import Link from "next/link";

const StepElem = props => {
  const { isFinal, text, path, order } = props;
  const pathdivided = path ? path.split("/") : "";
  let toPath = "";
  for (let i = 0; i <= order; i++) {
    toPath = toPath.concat(pathdivided[i]);
    if (i !== order) toPath = toPath.concat("/");
  }
  return (
    <>
      <Breadcrumb.Section>
        {!isFinal ? (
          <Link
            href={
              !isFinal
                ? toPath
                  ? `/dashboard?path=${encodeSGMAStr(toPath)}&pv=${md5(toPath)}`
                  : `/dashboard`
                : ""
            }
          >
            <a>{text}</a>
          </Link>
        ) : (
          text
        )}
      </Breadcrumb.Section>
      {!isFinal && (
        <Breadcrumb.Divider>
          <Icon name="right angle" />
        </Breadcrumb.Divider>
      )}
    </>
  );
};

const Steps = ({ path }) => {
  const isRoot = !path;
  const rootElem = (
    <StepElem isFinal={isRoot} text="내 문제함" icon="home" key={0} />
  );
  const pathArr = !isRoot ? path.split("/") : [];
  const elem = isRoot
    ? [rootElem]
    : [
        rootElem,
        ...pathArr.map((x, i) => {
          return (
            <StepElem
              key={"stepElem:" + i}
              isFinal={i === pathArr.length - 1}
              text={x}
              path={path}
              order={i}
            />
          );
        })
      ];
  return <Breadcrumb>{elem}</Breadcrumb>;
};

export default Steps;
