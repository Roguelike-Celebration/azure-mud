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
export const UserMapContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(reducer, {
    authenticated: false,
    checkedAuthentication: false,
    inMediaChat: false,
    messages: [],
    userMap: {},
  });

  useEffect(() => {
    getLoginInfo().then((r) => {
      let userId, name;
      if (r) {
        userId = r.user_claims[0].val;
        name = r.user_id;
        connect(userId, dispatch);
      }
      dispatch(AuthenticateAction(userId, name));
    });
  }, []);

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} />
  ) : (
    ""
  );

  if (!state.checkedAuthentication) {
    return <div />;
  }

  if (state.checkedAuthentication && !state.authenticated) {
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
      <UserMapContext.Provider value={state.userMap}>
        <div id="main">
          <RoomView room={state.room} />
          {profile}
          <ChatView messages={state.messages} />
          <InputView prepopulated={state.prepopulatedInput} />
        </div>
      </UserMapContext.Provider>
    </DispatchContext.Provider>
  );
};

export default App;
