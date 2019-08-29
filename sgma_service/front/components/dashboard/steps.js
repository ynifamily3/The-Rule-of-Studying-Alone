import { Breadcrumb, Icon } from "semantic-ui-react";
import Link from "next/link";

const StepElem = props => {
  const { isFinal, text } = props;
  return (
    <>
      <Breadcrumb.Section link={!isFinal}>{text}</Breadcrumb.Section>
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
              key={Math.random() + i}
              isFinal={i === pathArr.length - 1}
              text={x}
            />
          );
        })
      ];
  return <Breadcrumb>{elem}</Breadcrumb>;
};

export default Steps;
