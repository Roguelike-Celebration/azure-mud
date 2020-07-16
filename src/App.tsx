import React, { useEffect, createContext } from "react";

import RoomView from "./components/RoomView";
import ChatView from "./components/ChatView";
import InputView from "./components/InputView";
import { connect, getLoginInfo } from "./networking";
import reducer, { State } from "./reducer";
import { SetNameAction, Action } from "./Actions";
import ProfileView from "./components/ProfileView";
import { useReducerWithThunk } from "./useReducerWithThunk";

export const DispatchContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(reducer, {
    authenticated: false,
    messages: [],
    name: localStorage.getItem("name"),
  });

  useEffect(() => {
    getLoginInfo().then((r) => {
      console.log(r);
    });
    console.log("Connecting");
    let name = state.name;
    if (!state.name) {
      name = prompt("What is your user ID?");
      localStorage.setItem("name", name);
      dispatch(SetNameAction(name));
    }
    connect(name, dispatch);
  }, []);

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} />
  ) : (
    ""
  );

  if (!state.authenticated) {
    return (
      <a
        href={`https://mud.azurewebsites.net/.auth/login/twitter/?post_login_redirect_url=${encodeURIComponent(
          window.location.href
        )}`}
      >
        Log In
      </a>
    );
  }

  return (
    <DispatchContext.Provider value={dispatch}>
      <div id="main">
        <RoomView room={state.room} />
        {profile}
        <ChatView messages={state.messages} />
        <InputView prepopulated={state.prepopulatedInput} />
      </div>
    </DispatchContext.Provider>
  );
};

export default App;
