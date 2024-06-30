import React, { createContext, useEffect } from 'react'

import _ from 'lodash'
import { IconContext } from 'react-icons/lib'
import {
  Action,
  AuthenticateAction,
  IsRegisteredAction,
  LoadMessageArchiveAction,
  PlayerBannedAction,
  SendMessageAction,
  SetUseSimpleNamesAction,
  ShowSideMenuAction,
  SpaceIsClosedAction
} from './Actions'
import { currentUser, onAuthenticationStateChange } from './authentication'
import BadgesModalView from './components/BadgesModalView'
import BadgeUnlockModal from './components/BadgeUnlockModal'
import ClientDeployedModal from './components/ClientDeployedModal'
import CodeOfConductView from './components/CodeOfConductView'
import DisconnectModalView from './components/DisconnectModalView'
import EmailVerifiedView from './components/EmailVerifiedView'
import DullDoorModalView from './components/feature/DullDoorViews'
import FullRoomIndexModalView from './components/feature/FullRoomIndexViews'
import RainbowGateModalView from './components/feature/RainbowGateViews'
import GoHomeView from './components/GoHomeView'
import HappeningNowView from './components/HappeningNowView'
import HelpView from './components/HelpView'
import InputView from './components/InputView'
import LoggedOutView from './components/LoggedOutView'
import MapModalView from './components/MapModalView'
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
import VerifyEmailView from './components/VerifyEmailView'
import { VirtualizationProvider } from './components/VirtualizationProvider'
import WelcomeModalView from './components/WelcomeModalView'
import YouAreBannedView from './components/YouAreBannedView'
import { Modal } from './modals'
import { checkIsRegistered, connect } from './networking'
import reducer, { defaultState, State } from './reducer'
import * as Storage from './storage'
import { ThunkDispatch, useReducerWithThunk } from './useReducerWithThunk'
import SpecialTextModalView from './components/SpecialTextModalView'
import ReactTooltip from 'react-tooltip'

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

  useEffect(() => {
    // TODO: This flow has a lot of confusing, potentially duplicated messages that I'm not sure are necessary
    // I (Em) started a refactor at one point, but abandoned it since it became too irrelevant from my task
    onAuthenticationStateChange(async (user) => {
      if (!user) {
        dispatch(
          AuthenticateAction(undefined, undefined, undefined, undefined)
        )
      } else if (user.shouldVerifyEmail) {
        const userId = user.id
        const providerId = user.providerId
        dispatch(AuthenticateAction(userId, userId, providerId, true))
      } else {
        const user = currentUser()
        const userId = user.id
        const providerId = user.providerId

        const { registeredUsername, spaceIsClosed, isMod, isBanned } =
          await checkIsRegistered()
        if (!registeredUsername) {
          // If email, use ID to not leak, otherwise use service's default display name (for Twitter, their handle)
          const defaultDisplayName = user.email ? userId : user.displayName
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

        dispatch(IsRegisteredAction())
        connect(userId, dispatch)

        // WARNING: I don't know what this does.
        // When videochat existed, we had a warning that this no-op existed prior to videochat
        // So when I removed videochat, I left it here
        // (-Emilia)
        window.addEventListener('resize', () => {})
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
  if (
    currentUser() &&
    currentUser().isSignInWithEmailLink(window.location.href)
  ) {
    return <EmailVerifiedView />
  }

  if (!state.checkedAuthentication) {
    return <div />
  }

  if (state.checkedAuthentication && state.mustVerifyEmail) {
    return (
      <VerifyEmailView userEmail={currentUser().email} dispatch={dispatch} />
    )
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
        prepopulateTwitterWithDefaultHandle={
          state.authenticationProvider === 'twitter'
        }
      />
    )
  }

  if (state.isClosed && !state.userMap[state.userId].isMod) {
    return <GoHomeView />
  } else if (state.isBanned) {
    return <YouAreBannedView />
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
          unlockedBadges={state.profileData?.unlockedBadges}
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
        </MessagesContext.Provider>
      </DispatchContext.Provider>
    </IconContext.Provider>
  )
}

export default App
