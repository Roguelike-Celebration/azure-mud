import React, { useReducer, useEffect, createContext } from "react";

import RoomView from "./components/RoomView";
import ChatView from "./components/ChatView";
import InputView from "./components/InputView";
import { connect } from "./networking";
import reducer from "./reducer";
import { ActionType } from "./Actions";

export const DispatchContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    name: localStorage.getItem("name"),
  });

  useEffect(() => {
    console.log("Connecting");
    if (!state.name) {
      const name = prompt("What is your user ID?");
      localStorage.setItem("name", name);
      dispatch({ type: ActionType.SetName, value: name });
    }
    connect("lazerwalker", dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <div id="main">
        <RoomView room={state.room} />
        <ChatView messages={state.messages} />
        <InputView />
      </div>
    </DispatchContext.Provider>
  );
};

export default App;
