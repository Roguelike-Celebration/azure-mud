import React, { createContext, useEffect } from 'react'

import _ from 'lodash'
import { IconContext } from 'react-icons/lib'
import {
  Action,
  IsRegisteredAction,
  LoadMessageArchiveAction,
  PlayerBannedAction,
  SendMessageAction,
  SetCaptionsEnabledAction,
  SetKeepCameraWhenMovingAction,
  SetNumberOfFacesAction,
  SetTextOnlyModeAction,
  SetUserIdAction,
  SetUseSimpleNamesAction,
  ShowSideMenuAction,
  SpaceIsClosedAction
} from './Actions'
import BadgesModalView from './components/BadgesModalView'
import BadgeUnlockModal from './components/BadgeUnlockModal'
import ClientDeployedModal from './components/ClientDeployedModal'
import CodeOfConductView from './components/CodeOfConductView'
import DisconnectModalView from './components/DisconnectModalView'
import DullDoorModalView from './components/feature/DullDoorViews'
import FullRoomIndexModalView from './components/feature/FullRoomIndexViews'
import RainbowGateModalView from './components/feature/RainbowGateViews'
import GoHomeView from './components/GoHomeView'
import HappeningNowView from './components/HappeningNowView'
import HelpView from './components/HelpView'
import InputView from './components/InputView'
import LoggedOutView from './components/LoggedOutView'
import MapModalView from './components/MapModalView'
import MediaChatView from './components/MediaChatView'
import MediaSelectorView from './components/MediaSelectorView'
import { MessageList } from './components/MessageList'
import { ModalView } from './components/ModalView'
import { NoteWallView } from './components/NoteWallView'
import ProfileEditView from './components/ProfileEditView'
import ProfileView from './components/ProfileView'
import RiddleModalView from './components/RiddleModal'
import RoomListView from './components/RoomListView'
import RoomView from './components/RoomView'
import ScheduleView from './components/ScheduleView'
import ServerSettingsView from './components/ServerSettingsView'
import SettingsView from './components/SettingsView'
import SideNavView from './components/SideNavView'
import { VirtualizationProvider } from './components/VirtualizationProvider'
import WelcomeModalView from './components/WelcomeModalView'
import YouAreBannedView from './components/YouAreBannedView'
import { Modal } from './modals'
import { checkIsRegistered, configureNetworking, connect } from './networking'
import reducer, { defaultState, State } from './reducer'
import * as Storage from './storage'
import { ThunkDispatch, useReducerWithThunk } from './useReducerWithThunk'
import { TwilioChatContextProvider } from './videochat/twilioChatContext'
import SpecialTextModalView from './components/SpecialTextModalView'
import ReactTooltip from 'react-tooltip'
import { ObeliskView } from './components/ObeliskView'

export const DispatchContext =
  createContext<ThunkDispatch<Action, State>>(null)
export const MessagesContext = createContext<State['messages']>(null)
export const UserMapContext = createContext(null)
export const SettingsContext = createContext(null)
export const IsMobileContext = createContext(null)
export const RoomDataContext = createContext(null)

const App = () => {
  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )

  // The entire auth flow lives here
  // We are either: 
  // 1. Not able to automatically log in (no stored token)
  // 2. Able to log in but not registered (stored token, isRegistered finds no user), or
  // 3. A "full" user (a user exists on the server, and we have a token we assume is valid)
  // Cases 1 and 2 set some state and exit early, case 3 sets up the full app
  useEffect(() => {
    (async () => {
      // Check for presence of magic URL
      let queryParams = new URLSearchParams(window.location.search);
      const urlToken = queryParams.get('token');
      const urlUserId = queryParams.get('userId');
      if (urlToken && urlUserId) {
        console.log("token exists, setting and reloading")
        await Storage.setToken(urlUserId, urlToken);

        // Triggers a page refresh and also wipes away the query params
        window.location.search = ''
      }

      console.log("no token, checking storage")
      const tokenObj = await Storage.getToken()
      console.log('tokenobj', tokenObj)
      console.log(tokenObj)
      if (!tokenObj || !tokenObj.userId || !tokenObj.token) {
        // logged out
        console.log("no token found")
        return
      }

      console.log("token found, checking registration")

      const { userId, token } = tokenObj

      console.log("about to set up networking")
      dispatch(SetUserIdAction(userId));
      configureNetworking(userId, token, dispatch)
      
      const { registeredUsername, spaceIsClosed, isMod, isBanned } = await checkIsRegistered(userId)

      // User has logged in, but is not registered, show registration workflow
      // (triggered automatically by state.isRegistered = false, which is the default)
      if (!registeredUsername) { 
        return
      }

      // We have a valid user! Let's double-check they should be allowed in
      dispatch(IsRegisteredAction(registeredUsername))

      if (isBanned) {
        dispatch(
          PlayerBannedAction({
            id: userId,
            username: registeredUsername,
            isBanned: isBanned
          })
        )
        return
      }

      if (spaceIsClosed) {
        dispatch(SpaceIsClosedAction())

        if (!isMod) {
          // non-mods shouldn't subscribe to SignalR if the space is closed
          return
        }
      }

      // Cool, the person can see the space, let's do generic loading stuff
      // This all probably shouldn't live here, except for maybe the connect() call

        const messageArchive = await Storage.getMessages()
        // I'm styling it like a constant but it's just here; look it's late and the conf is in two days
        const MAX_MESSAGES_TO_LOAD = 400
        dispatch(
          LoadMessageArchiveAction(
            messageArchive
              ? messageArchive.messages.slice(-MAX_MESSAGES_TO_LOAD)
              : [],
            messageArchive ? messageArchive.whispers : []
          )
        )

        const useSimpleNames = await Storage.getUseSimpleNames()
        dispatch(SetUseSimpleNamesAction(useSimpleNames))
        const keepCameraWhenMoving = await Storage.getKeepCameraWhenMoving()
        dispatch(SetKeepCameraWhenMovingAction(keepCameraWhenMoving))
        const textOnlyMode = await Storage.getTextOnlyMode()
        dispatch(SetTextOnlyModeAction(textOnlyMode, false))
        const captionsEnabled = await Storage.getCaptionsEnabled()
        dispatch(SetCaptionsEnabledAction(captionsEnabled))

        connect()
    })()
  }, [])

  // Set up automatic resizing
  // I think this only exists for videochat, and can probably be killed?
  // TODO: Try killing this after the rest of my auth refactor is done
  useEffect(() => {
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
            const numberOfFaces =
              Math.floor($main.clientWidth / VideoWidth) - 1
            dispatch(SetNumberOfFacesAction(numberOfFaces))
          } else {
            console.warn(
              "Attempted to call onResize when 'main' element was null; will default to show no faces"
            )
          }
        }

        // Our initial paint time is stupid slow
        // but waiting a long time seems to ensure that #main exists
        setTimeout(onResize, 2000)
        window.addEventListener(
          'resize',
          _.throttle(onResize, 100, { trailing: true })
        )
  }, [])

  const isMobile = window.outerWidth < 500

  const profile = state.visibleProfile ? (
    <ProfileView user={state.visibleProfile} whispers={state.whispers} />
  ) : (
    ''
  )

  if ( !state.userId) {
    return <LoggedOutView />
  }

  if (!state.hasRegistered) {
    // Fetching the handle like this is silly.
    return (
      <ProfileEditView
        isFTUE={true}
        user={state.profileData}
      />
    )
  }

  if (state.isClosed && !state.userMap[state.userId].isMod) {
    return <GoHomeView />
  } else if (state.isBanned) {
    return <YouAreBannedView />
  }

  // It's slightly weird we now construct this here and pass it as a prop to
  // RoomView instead of constructing it there. Shrug, the conf is in 2 days.
  let videoChatView
  if (
    state.roomData &&
    state.roomId &&
    state.roomData[state.roomId] &&
    state.roomData[state.roomId].mediaChat
  ) {
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
  let modalIsUnclosable = false

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
        <NoteWallView
          roomDisplayName={room.displayName}
          notes={room.notes}
          noteWallData={room.noteWallData}
          roomData={state.roomData}
          user={state.profileData}
          serverSettings={state.serverSettings}
        />
      )
      break
    }
    case Modal.Settings: {
      innerModalView = (
        <SettingsView
          keepCameraWhenMoving={state.keepCameraWhenMoving}
          captionsEnabled={state.captionsEnabled}
          unlockedBadges={state.profileData?.unlockedBadges}
        />
      )
      break
    }
    case Modal.MediaSelector: {
      console.log('Opening media selector')
      // TODO: Fix this userIsSpeaking (it was...broken in the first place but if we're bordering we should do it here)
      innerModalView = (
        <MediaSelectorView
          showJoinButton={
            !state.inMediaChat || state.activeModalOptions.showJoinButton
          }
          hideVideo={state.activeModalOptions.hideVideo}
          userIsSpeaking={false}
          roomId={state.roomId}
          keepCameraWhenMoving={state.keepCameraWhenMoving}
        />
      )
      break
    }
    case Modal.Badges: {
      innerModalView = (
        <BadgesModalView
          equippedBadges={state.profileData?.equippedBadges}
          unlockedBadges={state.profileData?.unlockedBadges}
          unlockableBadges={state.unlockableBadges}
        />
      )
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
        <MapModalView
          presenceData={state.presenceData}
          currentRoomId={state.roomId}
        />
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
      innerModalView = (
        <ServerSettingsView
          serverSettings={state.serverSettings}
          roomData={state.roomData}
        />
      )
      break
    }
    case Modal.ClientDeployed: {
      innerModalView = <ClientDeployedModal />
      break
    }
    case Modal.Disconnected: {
      modalIsUnclosable = true
      innerModalView = <DisconnectModalView userId={state.userId} />
      break
    }
    case Modal.HappeningNow: {
      innerModalView = (
        <HappeningNowView
          roomData={state.roomData}
          entries={state.serverSettings.happeningNowEntries}
        />
      )
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
      innerModalView = (
        <FullRoomIndexModalView rooms={Object.values(state.roomData)} />
      )
      break
    }
    case Modal.Riddles: {
      const room = state.roomData[state.roomId]
      innerModalView = <RiddleModalView riddles={room.riddles} />
      break
    }
    case Modal.SpecialFeatureText: {
      const room = state.roomData[state.roomId]
      innerModalView = <SpecialTextModalView text={room.specialFeatureText} />
      break
    }
    case Modal.Obelisk: {
      innerModalView = <ObeliskView notes={state.obeliskNotes} user={state.profileData} />
    }
  }

  if (innerModalView) {
    modalView = (
      <ModalView fullScreen={modalIsFullScreen} unclosable={modalIsUnclosable}>
        {innerModalView}
      </ModalView>
    )
  }

  const showMenu = () => {
    dispatch(ShowSideMenuAction())
  }

  const shouldShowMenu = !isMobile || state.mobileSideMenuIsVisible

  // TODO: userMapContext should actually do the thing
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <DispatchContext.Provider value={dispatch}>
        <MessagesContext.Provider value={state.messages}>
          <TwilioChatContextProvider active={!state.textOnlyMode}>
            <IsMobileContext.Provider value={isMobile}>
              <SettingsContext.Provider
                value={{ useSimpleNames: state.useSimpleNames }}
              >
                <UserMapContext.Provider
                  value={{ userMap: state.userMap, myId: state.userId }}
                >
                  <RoomDataContext.Provider value={state.roomData}>
                    <div
                      id={
                        state.visibleProfile && !isMobile
                          ? 'app-profile-open'
                          : 'app'
                      }
                    >
                      <ReactTooltip />
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
                        <VirtualizationProvider>
                          <MessageList
                            autoscrollChat={state.autoscrollChat}
                            messagesLoadProgress={state.messagesLoadProgress}
                          />
                        </VirtualizationProvider>
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
        </MessagesContext.Provider>
      </DispatchContext.Provider>
    </IconContext.Provider>
  )
}

export default App
