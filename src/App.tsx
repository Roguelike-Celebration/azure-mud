import React, { useEffect, createContext } from 'react'

import RoomView from './components/RoomView'
import ChatView from './components/ChatView'
import InputView from './components/InputView'
import { connect, getLoginInfo, checkIsRegistered } from './networking'
import reducer, { State, defaultState } from './reducer'
import {
  AuthenticateAction,
  Action,
  IsRegisteredAction,
  LoadMessageArchiveAction,
  ShowSideMenuAction,
  SendMessageAction
} from './Actions'
import ProfileView from './components/ProfileView'
import { useReducerWithThunk } from './useReducerWithThunk'
import MediaChatView from './components/MediaChatView'
import ProfileEditView from './components/ProfileEditView'
import SideNavView from './components/SideNavView'
import { IconContext } from 'react-icons/lib'
import { Modal } from './modals'
import { NoteWallView } from './components/NoteWallView'
import { ModalView } from './components/ModalView'
import ThemeSelectorView from './components/ThemeSelectorView'
import MediaSelectorView from './components/MediaSelectorView'
import CodeOfConductView from './components/CodeOfConductView'
import ScheduleView from './components/ScheduleView'
import HelpView from './components/HelpView'
import MapModalView from './components/MapModalView'
import LoggedOutView from './components/LoggedOutView'

export const DispatchContext = createContext(null)
export const UserMapContext = createContext(null)
export const IsMobileContext = createContext(null)

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )

  useEffect(() => {
    // TODO: This logic is gnarly enough I'd love to abstract it somewhere
    const login = getLoginInfo().then((login) => {
      if (!login) {
        // This should really be its own action distinct from logging in
        dispatch(AuthenticateAction(undefined, undefined))
      } else {
        console.log(login)
        const userId = login.user_claims.find(c => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier').val

        checkIsRegistered().then((registeredUsername) => {
          if (!registeredUsername) {
            dispatch(AuthenticateAction(userId, login.user_id))
            return
          }
          dispatch(AuthenticateAction(userId, registeredUsername))

          let localLocalData = false
          const rawTimestamp = localStorage.getItem('messageTimestamp')
          const rawMessageData = localStorage.getItem('messages')
          if (rawTimestamp) {
            try {
              const timestamp = new Date(rawTimestamp)
              // A janky way to say "Is it older than an hour"
              localLocalData =
                  rawMessageData &&
                  new Date().getTime() - timestamp.getTime() < 1000 * 60 * 60
            } catch {
              console.log('Did not find a valid timestamp for message cache')
            }
          }

          if (localLocalData) {
            try {
              const messages = JSON.parse(rawMessageData)
              dispatch(LoadMessageArchiveAction(messages))
            } catch (e) {
              console.log('Could not parse message JSON', e)
            }
          }

          dispatch(IsRegisteredAction())
          connect(userId, dispatch)

          window.addEventListener('resize', () => {})
        })
      }
    })
  }, [])

  const isMobile = window.outerWidth < 500

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} messages={state.messages} />
  ) : (
    ''
  )

  if (!state.checkedAuthentication) {
    return <div />
  }

  if (state.checkedAuthentication && !state.authenticated) {
    return <LoggedOutView />
  }

  if (!state.hasRegistered) {
    // Fetching the handle like this is silly.
    return (
      <ProfileEditView
        isFTUE={true}
        defaultHandle={state.userMap[state.userId].username}
        user={state.profileData}
      />
    )
  }

  let videoChatView
  if (state.inMediaChat) {
    videoChatView = (
      <MediaChatView
        localMediaStreamId={state.localMediaStreamId}
        peerIds={state.otherMediaStreamPeerIds}
        videoDeviceId={state.currentVideoDeviceId}
        audioDeviceId={state.currentAudioDeviceId}
        speakingPeerIds={state.speakingPeerIds}
      />
    )
  }

  let innerModalView, modalView
  switch (state.activeModal) {
    case Modal.ProfileEdit: {
      innerModalView = (
        <ProfileEditView
          isFTUE={false}
          defaultHandle={state.userMap[state.userId].username}
          user={state.profileData}
        />
      )
      break
    }
    case Modal.NoteWall: {
      innerModalView = (
        <NoteWallView notes={state.roomData[state.roomId].notes} />
      )
      break
    }
    case Modal.ThemeSelector: {
      innerModalView = <ThemeSelectorView />
      break
    }
    case Modal.MediaSelector: {
      innerModalView = (
        <MediaSelectorView
          devices={state.mediaDevices}
          initialAudioDeviceId={state.currentAudioDeviceId}
          initialVideoDeviceId={state.currentVideoDeviceId}
          showJoinButton={!state.inMediaChat}
          userIsSpeaking={state.speakingPeerIds.includes('self')}
        />
      )
      break
    }
    case Modal.CodeOfConduct: {
      innerModalView = <CodeOfConductView />
      break
    }
    case Modal.Schedule: {
      innerModalView = <ScheduleView />
      break
    }
    case Modal.Map: {
      innerModalView = (
        <MapModalView roomData={state.roomData} currentRoomId={state.roomId} />
      )
      break
    }
    case Modal.Help: {
      innerModalView = <HelpView />
    }
  }

  if (innerModalView) {
    modalView = <ModalView>{innerModalView}</ModalView>
  }

  const showMenu = () => {
    dispatch(ShowSideMenuAction())
  }

  const shouldShowMenu = !isMobile || state.mobileSideMenuIsVisible

  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <DispatchContext.Provider value={dispatch}>
        <IsMobileContext.Provider value={isMobile}>
          <UserMapContext.Provider
            value={{ userMap: state.userMap, myId: state.userId }}
          >
            <div
              id={
                state.visibleProfile && !isMobile ? 'app-profile-open' : 'app'
              }
            >
              {shouldShowMenu ? (
                <SideNavView
                  rooms={Object.values(state.roomData)}
                  username={state.userMap[state.userId].username}
                />
              ) : (
                <button id="show-menu" onClick={showMenu}>
                  <span role="img" aria-label="menu">
                    🍔
                  </span>
                </button>
              )}
              {modalView}
              <div id="main" role="main">
                {videoChatView}
                {state.roomData[state.roomId] ? (
                  <RoomView
                    room={state.roomData[state.roomId]}
                    userId={state.userId}
                  />
                ) : null}
                <ChatView messages={state.messages} />
                <InputView
                  prepopulated={state.prepopulatedInput}
                  sendMessage={(message) =>
                    dispatch(SendMessageAction(message))
                  }
                />
              </div>
              {profile}
            </div>
          </UserMapContext.Provider>
        </IsMobileContext.Provider>
      </DispatchContext.Provider>
    </IconContext.Provider>
  )
}

export default App
