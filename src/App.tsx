import React, { useEffect, createContext } from "react";

import RoomView from "./components/RoomView";
import ChatView from "./components/ChatView";
import InputView from "./components/InputView";
import { connect, getLoginInfo } from "./networking";
import reducer, { State } from "./reducer";
import { AuthenticateAction, Action } from "./Actions";
import ProfileView from "./components/ProfileView";
import { useReducerWithThunk } from "./useReducerWithThunk";
import config from "./config";

export const DispatchContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(reducer, {
    authenticated: false,
    inMediaChat: false,
    messages: [],
    name: localStorage.getItem("name"),
  });

  useEffect(() => {
    getLoginInfo().then((r) => {
      if (r) {
        const name = r.user_id;
        connect(name, dispatch);
        dispatch(AuthenticateAction(name));
      }
    });
  }, []);

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} />
  ) : (
    ""
  );

  if (!state.authenticated) {
    return (
      <a
        href={`${
          config.SERVER_HOSTNAME
        }/.auth/login/twitter?post_login_redirect_url=${encodeURIComponent(
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
