import React, { useReducer, useEffect, createContext } from "react";

import RoomView from "./components/RoomView";
import ChatView from "./components/ChatView";
import InputView from "./components/InputView";
import { connect } from "./networking";
import reducer, { State } from "./reducer";
import { SetNameAction } from "./Actions";
import ProfileView from "./components/ProfileView";
import { useReducerWithThunk } from "./useReducerWithThunk";

export const DispatchContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducerWithThunk<State>(reducer, {
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
        <InputView prepopulated={state.prepopulatedInput} />
        {state.visibleProfile ? <ProfileView user={} /> : ""}
      </div>
    </DispatchContext.Provider>
  );
};

export default App;
