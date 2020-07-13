import React from "react";
import { Message, MessageType } from "../message";

export default (props: { message: Message }) => {
  const { message } = props;

  const messageMap = {
    [MessageType.Connected]: ConnectedMessageView,
    [MessageType.Disconnected]: DisconnectedMessageView,
    [MessageType.Entered]: EnteredView,
    [MessageType.Left]: LeftView,
    [MessageType.Chat]: ChatMessageView,
    [MessageType.Whisper]: WhisperView,
    [MessageType.Error]: ErrorView,
  };

  const component = messageMap[message.type];
  if (!component) {
    console.log("Unexpected message type", message.type);
    return <div />;
  }

  return React.createElement(component, message);
};

const ConnectedMessageView = (props: ConnectedMessage) => (
  <div>
    <strong>{props.name}</strong> has connected.
  </div>
);

const DisconnectedMessageView = (props: DisconnectedMessage) => (
  <div>
    <strong>{props.name}</strong> has disconnected.
  </div>
);

const EnteredView = (props: EnteredMessage) => {
  return (
    <div>
      <strong>{props.name}</strong> has entered from {props.from}.
    </div>
  );
};

const LeftView = (props: LeftMessage) => (
  <div>
    <strong>{props.name}</strong> has wandered off to {props.to}.
  </div>
);

const ChatMessageView = (props: ChatMessage) => (
  <div>
    <strong>{props.name}</strong>: {props.message}
  </div>
);

const WhisperView = (props: WhisperMessage) => {
  return (
    <div>
      <em>
        <strong>{props.name}</strong> whispers: {props.message}
      </em>
    </div>
  );
};

const ErrorView = (props: ErrorMessage) => {
  return <div>{props.error}</div>;
};
