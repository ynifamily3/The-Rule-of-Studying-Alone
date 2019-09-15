import React from "react";
import { Button, Modal, Header, Icon } from "semantic-ui-react";

/*
const Custommodal = props => (
  <Modal basic size="small" {...props}>
    <Header icon="archive" content="Archive Old Messages" />
    <Modal.Content>
      <p>{props.message ? props.message : "Loading..."}</p>
    </Modal.Content>
    <Modal.Actions>
      <Button basic color="red" inverted>
        <Icon name="remove" /> No
      </Button>
      <Button color="green" inverted>
        <Icon name="checkmark" /> Yes
      </Button>
    </Modal.Actions>
  </Modal>
);
*/

const Custommodal = props => (
  <Modal basic size="small" {...props}>
    <Modal.Content>
      <p style={{ textAlign: "center", fontSize: "1.5em" }}>
        {props.message ? props.message : "Loading..."}
      </p>
    </Modal.Content>
  </Modal>
);

export default Custommodal;
