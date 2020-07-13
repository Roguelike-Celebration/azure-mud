import * as React from "react";
import MessageView from "./MessageView";
import { Message } from "../message";

export default (props: { messages: Message[] }) => {
  console.log(props.messages);
  return (
    <div id="messages">
      {props.messages.map((m, idx) => {
        return <MessageView message={m} key={`message-${idx}`} />;
      })}
    </div>
  );
};
