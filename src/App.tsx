import React, { useEffect, createContext, useState } from "react";

import RoomView from "./components/RoomView";
import ChatView from "./components/ChatView";
import InputView from "./components/InputView";
import { connect, getLoginInfo, checkIsRegistered } from "./networking";
import reducer, { State } from "./reducer";
import { AuthenticateAction, Action, IsRegisteredAction } from "./Actions";
import ProfileView from "./components/ProfileView";
import { useReducerWithThunk } from "./useReducerWithThunk";
import config from "./config";
import MediaChatView from "./components/MediaChatView";
import ProfileEditView from "./components/ProfileEditView";

export const DispatchContext = createContext(null);
export const UserMapContext = createContext(null);

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(reducer, {
    authenticated: false,
    checkedAuthentication: false,
    hasLocalMediaStream: false,
    hasRegistered: false,
    messages: [],
    userMap: {},
  });

  useEffect(() => {
    // TODO: This logic is gnarly enough I'd love to abstract it somewhere
    const login = getLoginInfo().then((login) => {
      let userId, name;
      if (!login) {
        // This should really be its own action distinct from logging in
        dispatch(AuthenticateAction(undefined, undefined));
      } else {
        userId = login.user_claims[0].val;
        name = login.user_id;
        checkIsRegistered().then((registered) => {
          dispatch(AuthenticateAction(userId, name));
          if (registered) {
            dispatch(IsRegisteredAction());
            connect(userId, dispatch);
          }
        });
      }
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

  if (!state.hasRegistered) {
    // Fetching the handle like this is silly.
    return (
      <ProfileEditView
        isFTUE={true}
        defaultHandle={state.userMap[state.userId].username}
      />
    );
  }

  let videoChatView;
  if (state.localMediaStreamId) {
    videoChatView = (
      <MediaChatView
        localMediaStreamId={state.localMediaStreamId}
        peerIds={state.otherMediaStreamPeerIds}
        mediaDevices={state.mediaDevices}
      />
    );
  }

  return (
    <DispatchContext.Provider value={dispatch}>
      <UserMapContext.Provider
        value={{ userMap: state.userMap, myId: state.userId }}
      >
        <div id="main">
          {videoChatView}
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
