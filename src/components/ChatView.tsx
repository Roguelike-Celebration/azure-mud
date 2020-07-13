import React, { useEffect } from "react";
import MessageView from "./MessageView";
import { Message } from "../message";

export default (props: { messages: Message[] }) => {
  console.log(props.messages);

  React.useEffect(() => {
    const lastMessage = document.querySelector("#messages div:last-of-type");
    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  });

  return (
    <div id="messages">
      {props.messages.map((m, idx) => {
        return <MessageView message={m} key={`message-${idx}`} />;
      })}
    </div>
  );
};
