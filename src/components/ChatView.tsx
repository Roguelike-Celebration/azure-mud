import React from "react";
import MessageView from "./MessageView";
import { Message } from "../message";

import "../../style/chat.css";

export default (props: { messages: Message[] }) => {
  React.useEffect(() => {
    const lastMessage = document.querySelector("#messages div:last-of-type");
    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  });

  return (
    <div id="messages">
      {props.messages.map((m, idx) => {
        const id = `message-${idx}`;
        return <MessageView message={m} key={id} id={id} />;
      })}
    </div>
  );
};
