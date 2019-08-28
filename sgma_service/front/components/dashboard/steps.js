import { Icon, Step } from "semantic-ui-react";

const StepElem = props => {
  const { isFinal, text, icon } = props;
  return (
    <Step link={!isFinal} active={!!isFinal}>
      <Step.Content>
        <Step.Title>
          <Icon name={icon} />
          {text}
        </Step.Title>
      </Step.Content>
    </Step>
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
              icon="folder"
            />
          );
        })
      ];
  return (
    <Step.Group size="tiny" attached={false}>
      {elem}
    </Step.Group>
  );
};

export default Steps;
