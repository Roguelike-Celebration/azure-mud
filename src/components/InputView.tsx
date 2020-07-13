import React, { useContext, useState } from "react";
import { DispatchContext } from "../App";
import { ActionType, SendMessageAction } from "../Actions";

export default () => {
  const dispatch = useContext(DispatchContext);
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.currentTarget.value);

  const onClick = () => {
    dispatch(SendMessageAction(input));
  };

  return (
    <div id="input">
      <input type="text" id="chat-input" onChange={handleInputChange} />
      <button id="send" onClick={onClick}>
        Send
      </button>
    </div>
  );
};
