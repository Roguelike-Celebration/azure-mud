import React, { useReducer, useEffect, createContext } from "react";

import RoomView from "./components/RoomView";
import ChatView from "./components/ChatView";
import InputView from "./components/InputView";
import { connect } from "./networking";
import reducer from "./reducer";
import { ActionType, SetNameAction } from "./Actions";

export const DispatchContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    name: localStorage.getItem("name"),
  });

  useEffect(() => {
    console.log("Connecting");
    let name = state.name;
    if (!state.name) {
      name = prompt("What is your user ID?");
      localStorage.setItem("name", name);
      dispatch(SetNameAction(name));
    }
    connect(name, dispatch);
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
