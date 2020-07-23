import React from "react";
import {
  Message,
  MessageType,
  ConnectedMessage,
  DisconnectedMessage,
  EnteredMessage,
  LeftMessage,
  ChatMessage,
  WhisperMessage,
  ErrorMessage,
  ShoutMessage,
} from "../message";
import NameView from "./NameView";

export default (props: { message: Message; id: string }) => {
  const { message } = props;

  const messageMap = {
    [MessageType.Connected]: ConnectedMessageView,
    [MessageType.Disconnected]: DisconnectedMessageView,
    [MessageType.Entered]: EnteredView,
    [MessageType.Left]: LeftView,
    [MessageType.Chat]: ChatMessageView,
    [MessageType.Whisper]: WhisperView,
    [MessageType.Shout]: ShoutView,
    [MessageType.Error]: ErrorView,
  };

  const component = messageMap[message.type];
  if (!component) {
    console.log("Unexpected message type", message.type);
    return <div />;
  }

  return React.createElement(component, { ...message, id: props.id });
};

const ConnectedMessageView = (props: ConnectedMessage & { id: string }) => (
  <div>
    <NameView userId={props.userId} id={props.id} /> has connected.
  </div>
);

const DisconnectedMessageView = (
  props: DisconnectedMessage & { id: string }
) => (
  <div>
    <NameView userId={props.userId} id={props.id} /> has disconnected.
  </div>
);

const EnteredView = (props: EnteredMessage & { id: string }) => {
  return (
    <div>
      <NameView userId={props.userId} id={props.id} /> has entered from{" "}
      {props.from}.
    </div>
  );
};

const LeftView = (props: LeftMessage & { id: string }) => (
  <div>
    <NameView id={props.id} userId={props.userId} /> has wandered off to{" "}
    {props.to}.
  </div>
);

const ChatMessageView = (props: ChatMessage & { id: string }) => (
  <div>
    <NameView userId={props.userId} id={props.id} />: {props.message}
  </div>
);

const WhisperView = (props: WhisperMessage & { id: string }) => {
  if (props.senderIsSelf) {
    return (
      <div>
        <em>
          You whisper to <NameView id={props.id} userId={props.userId} />:{" "}
          {props.message}
        </em>
      </div>
    );
  } else {
    return (
      <div>
        <em>
          <NameView userId={props.userId} id={props.id} /> whispers:{" "}
          {props.message}
        </em>
      </div>
    );
  }
};

const ShoutView = (props: ShoutMessage & { id: string }) => {
  return (
    <div>
      <NameView userId={props.userId} id={props.id} /> shouts: {props.message}
    </div>
  );
};

const ErrorView = (props: ErrorMessage & { id: string }) => {
  return <div>{props.error}</div>;
};
