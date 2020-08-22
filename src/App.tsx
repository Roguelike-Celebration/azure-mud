import React, { useEffect, createContext, useState } from 'react'

import RoomView from './components/RoomView'
import ChatView from './components/ChatView'
import InputView from './components/InputView'
import { connect, getLoginInfo, checkIsRegistered } from './networking'
import reducer, { State, defaultState } from './reducer'
import { AuthenticateAction, Action, IsRegisteredAction, LoadMessageArchiveAction, ShowSideMenuAction } from './Actions'
import ProfileView from './components/ProfileView'
import { useReducerWithThunk } from './useReducerWithThunk'
import config from './config'
import MediaChatView from './components/MediaChatView'
import ProfileEditView from './components/ProfileEditView'
import RoomListView from './components/RoomListView'
import { IconContext } from 'react-icons/lib'
import { Modal } from './modals'
import { NoteWallView } from './components/NoteWallView'
import { ModalView } from './components/ModalView'
import ThemeSelectorView from './components/ThemeSelectorView'
import MediaSelectorView from './components/MediaSelectorView'

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
      let userId, name
      if (!login) {
        // This should really be its own action distinct from logging in
        dispatch(AuthenticateAction(undefined, undefined))
      } else {
        userId = login.user_claims[0].val
        name = login.user_id
        checkIsRegistered().then((registered) => {
          dispatch(AuthenticateAction(userId, name))
          if (registered) {
            let localLocalData = false
            const rawTimestamp = localStorage.getItem('messageTimestamp')
            const rawMessageData = localStorage.getItem('messages')
            if (rawTimestamp) {
              try {
                const timestamp = new Date(rawTimestamp)
                // A janky way to say "Is it older than an hour"
                localLocalData = rawMessageData && (new Date()).getTime() - timestamp.getTime() < 1000 * 60 * 60
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

            window.addEventListener('resize', () => {

            })
          }
        })
      }
    })
  }, [])

  const isMobile = window.outerWidth < 500

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} />
  ) : (
    ''
  )

  if (!state.checkedAuthentication) {
    return <div />
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
    )
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
      innerModalView = (
        <ThemeSelectorView />
      )
      break
    }
    case Modal.MediaSelector: {
      innerModalView =
        <MediaSelectorView
          devices={state.mediaDevices}
          initialAudioDeviceId={state.currentAudioDeviceId}
          initialVideoDeviceId={state.currentVideoDeviceId}
          showJoinButton={!state.inMediaChat}
          userIsSpeaking={state.speakingPeerIds.includes('self')}
        />
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
            <div id={state.visibleProfile && !isMobile ? 'app-profile-open' : 'app'}>
              {shouldShowMenu
                ? <RoomListView
                  rooms={Object.values(state.roomData)}
                  username={state.userMap[state.userId].username}
                />
                : <button id='show-menu' onClick={showMenu}><span role='img' aria-label='menu'>🍔</span></button>}
              {modalView}
              <div id="main" role="main">
                {videoChatView}
                <RoomView
                  room={state.roomData[state.roomId]}
                  userId={state.userId}
                />
                <ChatView messages={state.messages} />
                <InputView prepopulated={state.prepopulatedInput} />
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
