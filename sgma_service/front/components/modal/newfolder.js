import React from "react";
import { Button, Modal, Header, Icon } from "semantic-ui-react";

const NewFolder = props => (
  <Modal basic size="small" {...props}>
    <Modal.Content>
      <p style={{ textAlign: "center", fontSize: "1.5em" }}>
        {props.message ? props.message : "Loading..."}
      </p>
    </Modal.Content>
  </Modal>
);

export default NewFolder;
