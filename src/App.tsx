import React, { useEffect, createContext } from 'react'

import RoomView from './components/RoomView'
import ChatView from './components/ChatView'
import InputView from './components/InputView'
import { connect, checkIsRegistered, getServerSettings } from './networking'
import reducer, { State, defaultState } from './reducer'
import {
  AuthenticateAction,
  Action,
  IsRegisteredAction,
  LoadMessageArchiveAction,
  ShowSideMenuAction,
  SendMessageAction,
  SpaceIsClosedAction,
  PlayerBannedAction,
  SetKeepCameraWhenMovingAction,
  SetTextOnlyModeAction,
  SetNumberOfFacesAction,
  SetUseSimpleNamesAction,
  SetCaptionsEnabledAction
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
import SettingsView from './components/SettingsView'
import MediaSelectorView from './components/MediaSelectorView'
import CodeOfConductView from './components/CodeOfConductView'
import ScheduleView from './components/ScheduleView'
import HelpView from './components/HelpView'
import MapModalView from './components/MapModalView'
import LoggedOutView from './components/LoggedOutView'
import WelcomeModalView from './components/WelcomeModalView'
import GoHomeView from './components/GoHomeView'
import YouAreBannedView from './components/YouAreBannedView'
import RoomListView from './components/RoomListView'
import RainbowGateModalView from './components/feature/RainbowGateViews'
import DullDoorModalView from './components/feature/DullDoorViews'
import ServerSettingsView from './components/ServerSettingsView'
import ClientDeployedModal from './components/ClientDeployedModal'
import FullRoomIndexModalView from './components/feature/FullRoomIndexViews'
import HappeningNowView from './components/HappeningNowView'
import VerifyEmailView from './components/VerifyEmailView'
import EmailVerifiedView from './components/EmailVerifiedView'
import RiddleModalView from './components/RiddleModal'
import * as Storage from './storage'
import { TwilioChatContextProvider } from './videochat/twilioChatContext'
import { currentUser, onAuthenticationStateChange } from './authentication'
import _ from 'lodash'
import BadgesModalView from './components/BadgesModalView'
import BadgeUnlockModal from './components/BadgeUnlockModal'

export const DispatchContext = createContext(null)
export const UserMapContext = createContext(null)
export const SettingsContext = createContext(null)
export const IsMobileContext = createContext(null)
export const RoomDataContext = createContext(null)

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )

  useEffect(() => {
    // TODO: This flow has a lot of confusing, potentially duplicated messages that I'm not sure are necessary
    // I (Em) started a refactor at one point, but abandoned it since it became too irrelevant from my task
    onAuthenticationStateChange(async (user) => {
      if (!user) {
        dispatch(AuthenticateAction(undefined, undefined, undefined, undefined))
      } else if (user.shouldVerifyEmail) {
        const userId = user.id
        const providerId = user.providerId
        dispatch(AuthenticateAction(userId, userId, providerId, true))
      } else {
        const user = currentUser()
        const userId = user.id
        const providerId = user.providerId

        const { registeredUsername, spaceIsClosed, isMod, isBanned } = await checkIsRegistered()
        if (!registeredUsername) {
          // If email, use ID to not leak, otherwise use service's default display name (for Twitter, their handle)
          const defaultDisplayName = user.email
            ? userId
            : user.displayName
          dispatch(
            AuthenticateAction(userId, defaultDisplayName, providerId, false)
          )
          return
        }

        // TODO: I thiiiink we want this to be in an 'else'
        dispatch(
          AuthenticateAction(userId, registeredUsername, providerId, false)
        )

        if (isBanned) {
          dispatch(
            PlayerBannedAction({
              id: userId,
              username: registeredUsername,
              isBanned: isBanned
            })
          )
          dispatch(IsRegisteredAction())
          return
        }

        if (spaceIsClosed) {
          dispatch(SpaceIsClosedAction())

          if (!isMod) {
            // non-mods shouldn't subscribe to SignalR if the space is closed
            dispatch(IsRegisteredAction())
            return
          }
        }

        const messageArchive = await Storage.getMessages()
        if (messageArchive) {
          dispatch(
            LoadMessageArchiveAction(
              messageArchive.messages,
              messageArchive.whispers
            )
          )
        }

        const useSimpleNames = await Storage.getUseSimpleNames()
        dispatch(SetUseSimpleNamesAction(useSimpleNames))
        const keepCameraWhenMoving = await Storage.getKeepCameraWhenMoving()
        dispatch(SetKeepCameraWhenMovingAction(keepCameraWhenMoving))
        const textOnlyMode = await Storage.getTextOnlyMode()
        dispatch(SetTextOnlyModeAction(textOnlyMode, false))
        const captionsEnabled = await Storage.getCaptionsEnabled()
        dispatch(SetCaptionsEnabledAction(captionsEnabled))

        dispatch(IsRegisteredAction())
        connect(userId, dispatch)
        getServerSettings(dispatch)

        // WARNING: Prior to the "calculate number of faces for videochat" code,
        // there was a no-op resize handler here.
        // window.addEventListener('resize', () => {})
        // I frankly have no idea what this was doing,
        // and worry my changes will cause unexpected errors
        // -Em, 10/12/2021
        window.addEventListener('resize', () => {})
        const onResize = () => {
          // It seems like a smell to do this in here and have to grab into #main,
          // but I think it's fine?
          const VideoWidth = 180
          const $main = document.getElementById('main')
          // Addendum: in Firefox on Windows sometimes we get into this function with 'main' as null!
          if ($main) {
            const numberOfFaces = Math.floor($main.clientWidth / VideoWidth) - 1
            dispatch(SetNumberOfFacesAction(numberOfFaces))
          } else {
            console.warn('Attempted to call onResize when \'main\' element was null; will default to show no faces')
          }
        }

        // Our initial paint time is stupid slow
        // but waiting a long time seems to ensure that #main exists
        setTimeout(onResize, 2000)
        window.addEventListener('resize', _.throttle(onResize, 100, { trailing: true }))
      }
    })
  }, [])

  const isMobile = window.outerWidth < 500

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} whispers={state.whispers} />
  ) : (
    ''
  )

  // This is kind of janky!
  if (currentUser() && currentUser().isSignInWithEmailLink(window.location.href)) {
    return <EmailVerifiedView />
  }

  if (!state.checkedAuthentication) {
    return <div />
  }

  if (state.checkedAuthentication && state.mustVerifyEmail) {
    return <VerifyEmailView
      userEmail={currentUser().email}
      dispatch={dispatch}
    />
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
        prepopulateTwitterWithDefaultHandle={state.authenticationProvider === 'twitter'}
      />
    )
  }

  if (state.isClosed && !state.userMap[state.userId].isMod) {
    return <GoHomeView />
  } else if (state.isBanned) {
    return <YouAreBannedView />
  }

  // It's slightly weird we now construct this here and pass it as a prop to RoomView instead of constructing it there.
  // Shrug, the conf is in 2 days.
  let videoChatView
  if (state.roomData && state.roomId && state.roomData[state.roomId] && state.roomData[state.roomId].mediaChat) {
    videoChatView = (
      <MediaChatView
        visibleSpeakers={state.visibleSpeakers}
        currentSpeaker={state.currentSpeaker}
        numberOfFaces={state.numberOfFaces}
        inMediaChat={state.inMediaChat}
        textOnlyMode={state.textOnlyMode}
        audioOnlyMode={state.audioOnlyMode}
        currentUser={state.userMap[state.userId]}
      />
    )
  }

  let innerModalView, modalView

  // TODO: If we get more modal options than just a size boolean, make this an options object.
  let modalIsFullScreen = false

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
      const room = state.roomData[state.roomId]
      innerModalView = (
        <NoteWallView notes={room.notes} noteWallData={room.noteWallData} user={state.profileData} serverSettings={state.serverSettings} />
      )
      break
    }
    case Modal.Settings: {
      innerModalView = <SettingsView keepCameraWhenMoving={state.keepCameraWhenMoving} captionsEnabled={state.captionsEnabled} />
      break
    }
    case Modal.MediaSelector: {
      console.log('Opening media selector')
      // TODO: Fix this userIsSpeaking (it was...broken in the first place but if we're bordering we should do it here)
      innerModalView = (
        <MediaSelectorView
          showJoinButton={!state.inMediaChat || state.activeModalOptions.showJoinButton}
          hideVideo={state.activeModalOptions.hideVideo}
          userIsSpeaking={false}
          roomId={state.roomId}
          keepCameraWhenMoving={state.keepCameraWhenMoving}
        />
      )
      break
    }
    case Modal.Badges: {
      innerModalView = <BadgesModalView
        equippedBadges={state.profileData?.equippedBadges}
        unlockedBadges={state.profileData?.unlockedBadges}
        unlockableBadges={state.unlockableBadges}
      />
      break
    }
    case Modal.BadgeUnlock: {
      innerModalView = <BadgeUnlockModal badge={state.justUnlockedBadge} />
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
      modalIsFullScreen = true
      innerModalView = (
        <MapModalView presenceData={state.presenceData} currentRoomId={state.roomId} />
      )
      break
    }
    case Modal.RoomList: {
      innerModalView = <RoomListView rooms={Object.values(state.roomData)} />
      break
    }
    case Modal.Help: {
      innerModalView = <HelpView />
      break
    }
    case Modal.Welcome: {
      innerModalView = <WelcomeModalView />
      break
    }
    case Modal.ServerSettings: {
      innerModalView = <ServerSettingsView serverSettings={state.serverSettings} roomData={state.roomData}/>
      break
    }
    case Modal.ClientDeployed: {
      innerModalView = <ClientDeployedModal />
      break
    }
    case Modal.HappeningNow: {
      innerModalView = <HappeningNowView roomData={state.roomData} entries={state.serverSettings.happeningNowEntries}/>
      break
    }
    case Modal.FeatureRainbowGate: {
      innerModalView = <RainbowGateModalView />
      break
    }
    case Modal.FeatureDullDoor: {
      innerModalView = <DullDoorModalView />
      break
    }
    case Modal.FeatureFullRoomIndex: {
      innerModalView = <FullRoomIndexModalView rooms={Object.values(state.roomData)}/>
      break
    }
    case Modal.Riddles: {
      const room = state.roomData[state.roomId]
      innerModalView = <RiddleModalView riddles={room.riddles}/>
      break
    }
  }

  if (innerModalView) {
    modalView = <ModalView fullScreen={modalIsFullScreen}>{innerModalView}</ModalView>
  }

  const showMenu = () => {
    dispatch(ShowSideMenuAction())
  }

  const shouldShowMenu = !isMobile || state.mobileSideMenuIsVisible

  // TODO: userMapContext should actually do the thing
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <DispatchContext.Provider value={dispatch}>
        <TwilioChatContextProvider active={!state.textOnlyMode}>
          <IsMobileContext.Provider value={isMobile}>
            <SettingsContext.Provider value={{ useSimpleNames: state.useSimpleNames }}>
              <UserMapContext.Provider
                value={{ userMap: state.userMap, myId: state.userId }}
              >
                <RoomDataContext.Provider value={state.roomData}>
                  <div
                    id={
                      state.visibleProfile && !isMobile ? 'app-profile-open' : 'app'
                    }
                  >
                    {shouldShowMenu ? (
                      <span>
                        <SideNavView
                          presenceData={state.presenceData}
                          currentRoomId={state.roomId}
                          username={state.userMap[state.userId].username}
                          spaceIsClosed={state.isClosed}
                        />
                        {/* Once we moved the sidebar to be position:fixed, we still
                      needed something to take up its space in the CSS grid.
                      This should be fixable via CSS, but sigh, it's 3 days before the event */}
                        <div id="side-nav-placeholder" />
                      </span>
                    ) : (
                      <button id="show-menu" onClick={showMenu}>
                        <span role="img" aria-label="menu">
                          🍔
                        </span>
                      </button>
                    )}
                    {modalView}
                    <div id="main" role="main">
                      {state.roomData[state.roomId] ? (
                        <RoomView
                          room={state.roomData[state.roomId]}
                          userId={state.userId}
                          roomData={state.roomData}
                          presenceData={state.presenceData}
                          inMediaChat={state.inMediaChat}
                          keepCameraWhenMoving={state.keepCameraWhenMoving}
                          textOnlyMode={state.textOnlyMode}
                          mediaChatView={videoChatView}
                          hasDismissedAModal={state.hasDismissedAModal}
                        />
                      ) : null}
                      <ChatView
                        messages={state.messages}
                        autoscrollChat={state.autoscrollChat}
                        serverSettings={state.serverSettings}
                        captionsEnabled={state.captionsEnabled}
                      />
                      <InputView
                        prepopulated={state.prepopulatedInput}
                        sendMessage={(message) =>
                          dispatch(SendMessageAction(message))
                        }
                        usersInRoom={state.roomData[state.roomId]?.users}
                      />
                    </div>
                    {profile}
                  </div>
                </RoomDataContext.Provider>
              </UserMapContext.Provider>
            </SettingsContext.Provider>
          </IsMobileContext.Provider>
        </TwilioChatContextProvider>
      </DispatchContext.Provider>
    </IconContext.Provider>
  )
}

export default App
